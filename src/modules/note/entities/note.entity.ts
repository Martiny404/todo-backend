import { BaseColumns } from 'src/common/classes/base-entity.class';
import { Folder } from 'src/modules/folder/entities/folder.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Note extends BaseColumns {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true, name: 'file_path' })
  filePath: string;

  @Column({ type: 'boolean', name: 'is_completed', default: false })
  isCompleted: boolean;

  @ManyToOne(() => Folder, (folder) => folder.notes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'folder_id' })
  folder: Folder;

  @ManyToOne(() => User, (user) => user.folders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
