import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Schedule } from './schedule.entity';

@Entity({ name: 'films' })
export class Film {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'real', default: 0 })
  rating: number;

  @Column({ type: 'varchar', default: '' })
  director: string;

  @Column({ type: 'varchar', array: true, default: () => "'{}'" })
  tags: string[];

  @Column({ type: 'varchar', default: '' })
  image: string;

  @Column({ type: 'varchar', default: '' })
  cover: string;

  @Column({ type: 'varchar', default: '' })
  title: string;

  @Column({ type: 'text', default: '' })
  about: string;

  @Column({ type: 'text', default: '' })
  description: string;

  @OneToMany(() => Schedule, (schedule) => schedule.film, {
    cascade: true,
    eager: true,
  })
  schedule: Schedule[];
}
