import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request as ExpressRequest,
} from '@nestjs/common';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    id: number;
    email: string;
  };
}
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}
  @Post()
  create(
    @Body() createNoteDto: CreateNoteDto,
    @ExpressRequest() req: RequestWithUser,
  ) {
    return this.notesService.create(createNoteDto, req.user.id);
  }

  @Get()
  findAll(@ExpressRequest() req: RequestWithUser) {
    return this.notesService.findAll(req.user.id);
  }
  @Get(':id')
  findOne(@Param('id') id: string, @ExpressRequest() req: RequestWithUser) {
    return this.notesService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @ExpressRequest() req: RequestWithUser,
  ) {
    return this.notesService.update(+id, updateNoteDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @ExpressRequest() req: RequestWithUser) {
    return this.notesService.remove(+id, req.user.id);
  }

  @Post(':id/tags/:tagId')
  addTag(
    @Param('id') id: string,
    @Param('tagId') tagId: string,
    @ExpressRequest() req: RequestWithUser,
  ) {
    return this.notesService.addTag(+id, +tagId, req.user.id);
  }

  @Delete(':id/tags/:tagId')
  removeTag(
    @Param('id') id: string,
    @Param('tagId') tagId: string,
    @ExpressRequest() req: RequestWithUser,
  ) {
    return this.notesService.removeTag(+id, +tagId, req.user.id);
  }
}
