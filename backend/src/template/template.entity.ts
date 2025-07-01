import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Template {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  templateName: string;

  @Column()
  image: string;

  @Column({ nullable: true }) // добавляем поддержку штрихкода
  ean13: string;
}
