import { BaseColumns } from 'src/common/classes/base-entity.class';
import { Role } from 'src/modules/role/entities/role.entity';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity()
export class User extends BaseColumns {
  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @ManyToMany(() => Role, (role) => role.users, {
    eager: true,
    onDelete: 'CASCADE',
  })
  roles: Role[];
}
