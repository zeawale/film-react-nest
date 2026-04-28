import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film } from './film.entity';
import { Schedule } from './schedule.entity';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async findAll(): Promise<Film[]> {
    return this.filmRepository.find();
  }

  async findById(id: string): Promise<Film | null> {
    return this.filmRepository.findOne({ where: { id } });
  }

  async updateScheduleTaken(
    filmId: string,
    sessionId: string,
    taken: string[],
  ): Promise<void> {
    await this.scheduleRepository.update({ id: sessionId, filmId }, { taken });
  }
}
