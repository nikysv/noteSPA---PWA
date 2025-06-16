import { Note } from '../entities/note.entity';

export type NoteCreateInput = Omit<Partial<Note>, 'tags'> & {
  tags?: number[];
};

export type NoteUpdateInput = Omit<Partial<Note>, 'tags'> & {
  tags?: number[];
};
