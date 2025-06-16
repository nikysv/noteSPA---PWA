import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tag } from '../../tags/entities/tag.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'note' }) // usa el mismo nombre exacto de la tabla
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({ default: false })
  archived: boolean;

  @Column({ name: 'user_id' })
  userId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToMany(() => Tag)
  @JoinTable({
    name: 'note_tags',
    joinColumn: { name: 'note_id' },
    inverseJoinColumn: { name: 'tag_id' },
  })
  tags: Tag[];
}
