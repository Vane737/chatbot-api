import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class VectorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text') // Tipo de columna vectorial proporcionada por la extensión pgvector
  title: string;

  @Column('text') // Tipo de columna vectorial proporcionada por la extensión pgvector
  body: string;

  @Column('float', {array: true }) // Tipo de columna vectorial proporcionada por la extensión pgvector
  embedding: number[];

}
