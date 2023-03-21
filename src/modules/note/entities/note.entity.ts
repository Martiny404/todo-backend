import { BaseColumns } from 'src/common/classes/base-entity.class';
import { Column, Entity } from 'typeorm';

@Entity()
export class Note extends BaseColumns {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  image: string;
}
