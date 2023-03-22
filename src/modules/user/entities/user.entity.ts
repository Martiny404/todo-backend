import { BaseColumns } from 'src/common/classes/base-entity.class';
import { Basket } from 'src/modules/basket/entities/basket.entity';
import { Folder } from 'src/modules/folder/entities/folder.entity';
import { Note } from 'src/modules/note/entities/note.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';

@Entity()
export class User extends BaseColumns {
  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  avatar: string;

  @ManyToMany(() => Role, (role) => role.users, {
    eager: true,
    onDelete: 'CASCADE',
  })
  roles: Role[];

  @OneToMany(() => Folder, (folders) => folders.user)
  folders: Folder[];

  @OneToMany(() => Note, (notes) => notes.user)
  notes: Note[];

  @OneToMany(() => Basket, (basket) => basket.user)
  basket: Basket;
}
