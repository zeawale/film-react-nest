import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { FilmsRepository } from '../repository/films.repository';
import {
  CreateOrderDto,
  CreatedTicketDto,
  OrderResponseDto,
} from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async createOrder(order: CreateOrderDto): Promise<OrderResponseDto> {
    const { tickets } = order;

    const filmCache: Record<
      string,
      Awaited<ReturnType<FilmsRepository['findById']>>
    > = {};

    const getFilm = async (filmId: string) => {
      if (!filmCache[filmId]) {
        filmCache[filmId] = await this.filmsRepository.findById(filmId);
      }
      return filmCache[filmId];
    };

    const newTakenMap = new Map<string, Set<string>>();

    const items: CreatedTicketDto[] = [];

    for (const ticket of tickets) {
      const film = await getFilm(ticket.film);
      if (!film) {
        throw new NotFoundException(`Film with id "${ticket.film}" not found`);
      }

      const session = film.schedule.find((s) => s.id === ticket.session);
      if (!session) {
        throw new NotFoundException(
          `Session with id "${ticket.session}" not found`,
        );
      }

      const seatKey = `${ticket.row}:${ticket.seat}`;

      if (session.taken.includes(seatKey)) {
        throw new BadRequestException(
          `Seat ${seatKey} is already taken in session "${ticket.session}"`,
        );
      }

      if (!newTakenMap.has(ticket.session)) {
        newTakenMap.set(ticket.session, new Set());
      }
      const newSeats = newTakenMap.get(ticket.session)!;

      if (newSeats.has(seatKey)) {
        throw new BadRequestException(
          `Duplicate seat ${seatKey} in session "${ticket.session}"`,
        );
      }

      newSeats.add(seatKey);
      items.push({ ...ticket, id: randomUUID() });
    }

    for (const [sessionId, newSeats] of newTakenMap.entries()) {
      const filmId = tickets.find((t) => t.session === sessionId)!.film;
      const film = await getFilm(filmId);
      const session = film!.schedule.find((s) => s.id === sessionId)!;
      const updatedTaken = [...session.taken, ...newSeats];

      await this.filmsRepository.updateScheduleTaken(
        filmId,
        sessionId,
        updatedTaken,
      );
    }

    return { total: items.length, items };
  }
}
