import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Schedule, ScheduleSchema } from './schedule.schema';

export type FilmDocument = HydratedDocument<Film>;

@Schema({ collection: 'films' })
export class Film {
  @Prop({ required: true })
  id: string;

  @Prop()
  rating: number;

  @Prop()
  director: string;

  @Prop({ type: [String] })
  tags: string[];

  @Prop()
  image: string;

  @Prop()
  cover: string;

  @Prop()
  title: string;

  @Prop()
  about: string;

  @Prop()
  description: string;

  @Prop({ type: [ScheduleSchema], default: [] })
  schedule: Schedule[];
}

export const FilmSchema = SchemaFactory.createForClass(Film);
