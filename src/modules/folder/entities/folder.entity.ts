import { BaseColumns } from 'src/common/classes/base-entity.class';
import { Column, Entity } from 'typeorm';

@Entity()
export class Folder extends BaseColumns {
  @Column()
  name: string;
}
