import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { TagsModule } from '../tags/tags.module';

@Module({
  imports: [TypeOrmModule.forFeature([Note]), TagsModule],
  providers: [NotesService],
  controllers: [NotesController],
})
export class NotesModule {}
