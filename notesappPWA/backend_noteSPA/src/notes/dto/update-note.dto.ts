import {
  IsOptional,
  IsArray,
  IsNumber,
  IsString,
  IsBoolean,
} from 'class-validator';
import { NoteUpdateInput } from '../types/note.types';

export class UpdateNoteDto implements Omit<NoteUpdateInput, 'userId'> {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsBoolean()
  archived?: boolean;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  tags?: number[];
}
