import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Template {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;          // отображаемое имя (Докторская)

  @Column()
  templateName: string;  // имя html-файла (docktorskaya)

  @Column()
  image: string;         // имя картинки (docktorskaya.jpg)
}
