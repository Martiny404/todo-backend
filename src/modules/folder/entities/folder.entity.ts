import { BaseColumns } from 'src/common/classes/base-entity.class';
import { Note } from 'src/modules/note/entities/note.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Folder extends BaseColumns {
  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.folders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Note, (notes) => notes.folder)
  notes: Note[];
}
