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
    }

    const takenMap = new Map<string, string[]>();
    const items: CreatedTicketDto[] = [];

    for (const ticket of tickets) {
      const film = await getFilm(ticket.film);
      const session = film!.schedule.find((s) => s.id === ticket.session)!;

      const cacheKey = `${ticket.film}::${ticket.session}`;
      if (!takenMap.has(cacheKey)) {
        takenMap.set(cacheKey, [...session.taken]);
      }

      const currentTaken = takenMap.get(cacheKey)!;
      const seatKey = `${ticket.row}:${ticket.seat}`;

      if (currentTaken.includes(seatKey)) {
        throw new BadRequestException(
          `Seat ${seatKey} is already taken in session "${ticket.session}"`,
        );
      }

      currentTaken.push(seatKey);
      takenMap.set(cacheKey, currentTaken);

      await this.filmsRepository.updateScheduleTaken(
        ticket.film,
        ticket.session,
        currentTaken,
      );

      items.push({ ...ticket, id: randomUUID() });
    }

    return { total: items.length, items };
  }
}
