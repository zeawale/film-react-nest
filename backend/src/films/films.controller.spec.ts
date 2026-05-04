import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmScheduleResponseDto, FilmsResponseDto } from './dto/films.dto';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: jest.Mocked<FilmsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: {
            findAll: jest.fn(),
            findSchedule: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    service = module.get(FilmsService);
  });

  it('должен быть определён', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /films (findAll)', () => {
    it('должен возвращать список фильмов из сервиса', async () => {
      const expected: FilmsResponseDto = {
        total: 1,
        items: [
          {
            id: 'film-1',
            rating: 8.5,
            director: 'Director',
            tags: ['drama'],
            image: '/img.jpg',
            cover: '/cover.jpg',
            title: 'Title',
            about: 'about',
            description: 'desc',
          },
        ],
      };
      service.findAll.mockResolvedValue(expected);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expected);
    });

    it('должен возвращать пустой список, если фильмов нет', async () => {
      service.findAll.mockResolvedValue({ total: 0, items: [] });

      const result = await controller.findAll();

      expect(result.total).toBe(0);
      expect(result.items).toEqual([]);
    });

    it('должен пробрасывать ошибки сервиса наружу', async () => {
      service.findAll.mockRejectedValue(new Error('DB unavailable'));

      await expect(controller.findAll()).rejects.toThrow('DB unavailable');
    });
  });

  describe('GET /films/:id/schedule (findSchedule)', () => {
    it('должен возвращать расписание для указанного id фильма', async () => {
      const filmId = 'film-1';
      const expected: FilmScheduleResponseDto = {
        total: 1,
        items: [
          {
            id: 'session-1',
            daytime: '2026-05-10T18:00',
            hall: 1,
            rows: 5,
            seats: 10,
            price: 350,
            taken: [],
          },
        ],
      };
      service.findSchedule.mockResolvedValue(expected);

      const result = await controller.findSchedule(filmId);

      expect(service.findSchedule).toHaveBeenCalledWith(filmId);
      expect(service.findSchedule).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expected);
    });

    it('должен пробрасывать NotFoundException, если фильм не найден', async () => {
      service.findSchedule.mockRejectedValue(
        new NotFoundException('Film with id missing not found'),
      );

      await expect(controller.findSchedule('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
