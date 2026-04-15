import { Injectable, NotFoundException } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import {
  FilmDto,
  FilmScheduleResponseDto,
  FilmsResponseDto,
  ScheduleDto,
} from './dto/films.dto';
import { Film } from '../repository/film.schema';
import { Schedule } from '../repository/schedule.schema';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  private toFilmDto(film: Film): FilmDto {
    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      image: film.image,
      cover: film.cover,
      title: film.title,
      about: film.about,
      description: film.description,
    };
  }

  private toScheduleDto(session: Schedule): ScheduleDto {
    return {
      id: session.id,
      daytime: session.daytime,
      hall: session.hall,
      rows: session.rows,
      seats: session.seats,
      price: session.price,
      taken: session.taken,
    };
  }

  async findAll(): Promise<FilmsResponseDto> {
    const films = await this.filmsRepository.findAll();
    const items = films.map((f) => this.toFilmDto(f));
    return { total: items.length, items };
  }

  async findSchedule(id: string): Promise<FilmScheduleResponseDto> {
    const film = await this.filmsRepository.findById(id);
    if (!film) {
      throw new NotFoundException(`Film with id ${id} not found`);
    }
    const items = film.schedule.map((s) => this.toScheduleDto(s));
    return { total: items.length, items };
  }
}
