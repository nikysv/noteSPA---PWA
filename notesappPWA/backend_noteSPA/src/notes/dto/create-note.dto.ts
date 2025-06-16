import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { NoteCreateInput } from '../types/note.types';

export class CreateNoteDto implements Omit<NoteCreateInput, 'userId'> {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsBoolean()
  archived?: boolean;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  tags?: number[];
}
