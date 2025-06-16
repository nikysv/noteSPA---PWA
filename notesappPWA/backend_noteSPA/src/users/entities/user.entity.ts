import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Note } from 'src/notes/entities/note.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150, unique: true })
  email: string;

  @Column()
  @Exclude() // This ensures the password is never sent in responses
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Note, (note) => note.user)
  notes: Note[];

  @OneToMany(() => Tag, (tag) => tag.user)
  tags: Tag[];
}
