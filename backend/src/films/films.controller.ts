import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmScheduleResponseDto, FilmsResponseDto } from './dto/films.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async findAll(): Promise<FilmsResponseDto> {
    return this.filmsService.findAll();
  }

  @Get(':id/schedule')
  async findSchedule(
    @Param('id') id: string,
  ): Promise<FilmScheduleResponseDto> {
    return this.filmsService.findSchedule(id);
  }
}
