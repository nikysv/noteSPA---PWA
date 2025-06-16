import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Note } from '../../notes/entities/note.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'tags' })
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 50 })
  color: string;

  @Column({ name: 'user_id' })
  userId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToMany(() => Note, (note) => note.tags)
  @JoinTable({
    name: 'note_tags', // Corregido para que coincida con la entidad Note
    joinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'note_id',
      referencedColumnName: 'id',
    },
  })
  notes: Note[];
}
