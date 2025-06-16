// src/notes/notes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Note } from './entities/note.entity';
import { Tag } from '../tags/entities/tag.entity';
import { NoteCreateInput, NoteUpdateInput } from './types/note.types';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private noteRepo: Repository<Note>,
    @InjectRepository(Tag)
    private tagRepo: Repository<Tag>,
  ) {}
  async findAll(userId: number): Promise<Note[]> {
    try {
      return await this.noteRepo.find({
        where: { userId },
        relations: ['tags'],
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw new Error(`Failed to fetch notes: ${error.message}`);
    }
  }

  async findOne(id: number, userId?: number): Promise<Note> {
    const where: any = { id };
    if (userId) {
      where.userId = userId;
    }

    const note = await this.noteRepo.findOne({
      where,
      relations: ['tags'],
    });

    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return note;
  }
  async create(data: NoteCreateInput, userId: number): Promise<Note> {
    try {
      // Validate required fields
      if (!data.title?.trim() || !data.content?.trim()) {
        throw new Error('Title and content are required and cannot be empty');
      }

      // Clean up the data
      const cleanData = {
        ...data,
        title: data.title.trim(),
        content: data.content.trim(),
      };

      // Extract tags IDs from the request
      const tagsIds = cleanData.tags || [];
      const { tags, ...noteData } = cleanData;

      // Create the note without tags first
      const note = this.noteRepo.create({
        ...noteData,
        userId,
      });
      await this.noteRepo.save(note);

      // If there are tags, fetch and attach them
      if (tagsIds.length > 0) {
        const tags = await this.tagRepo.findBy({
          id: In(tagsIds),
          userId, // Only fetch tags that belong to the user
        });
        note.tags = tags;
        await this.noteRepo.save(note);
      }

      // Return the note with its relations
      return this.findOne(note.id, userId);
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  }
  async update(
    id: number,
    updateData: NoteUpdateInput,
    userId: number,
  ): Promise<Note> {
    const note = await this.findOne(id, userId);
    if (note.userId !== userId) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    // Handle tags separately
    const tagsIds = updateData.tags;
    delete updateData.tags; // Update basic note data
    const { tags: _tags, ...updateFields } = updateData;
    await this.noteRepo.update(id, updateFields); // If tags are provided, update them
    if (tagsIds !== undefined) {
      const updatedNote = await this.noteRepo.findOne({
        where: { id },
        relations: ['tags'],
      });

      if (!updatedNote) {
        throw new NotFoundException(`Note with ID ${id} not found`);
      }

      if (tagsIds.length > 0) {
        const tags = await this.tagRepo.findBy({
          id: In(tagsIds),
          userId,
        });
        updatedNote.tags = tags;
        await this.noteRepo.save(updatedNote);
      } else {
        // If tags array is empty, remove all tags
        updatedNote.tags = [];
        await this.noteRepo.save(updatedNote);
      }
    }

    return this.findOne(id, userId);
  }

  async remove(id: number, userId: number) {
    const note = await this.findOne(id, userId);
    if (note.userId !== userId) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return this.noteRepo.delete(id);
  }
  async addTag(noteId: number, tagId: number, userId: number): Promise<Note> {
    const note = await this.noteRepo.findOne({
      where: { id: noteId, userId },
      relations: ['tags'],
    });
    if (!note) {
      throw new NotFoundException(`Note with ID ${noteId} not found`);
    }

    const tag = await this.tagRepo.findOneBy({ id: tagId, userId });
    if (!tag) {
      throw new NotFoundException(`Tag with ID ${tagId} not found`);
    }

    note.tags = [...(note.tags || []), tag];
    return this.noteRepo.save(note);
  }

  async removeTag(
    noteId: number,
    tagId: number,
    userId: number,
  ): Promise<Note> {
    const note = await this.noteRepo.findOne({
      where: { id: noteId, userId },
      relations: ['tags'],
    });
    if (!note) {
      throw new NotFoundException(`Note with ID ${noteId} not found`);
    }

    const tag = await this.tagRepo.findOneBy({ id: tagId, userId });
    if (!tag) {
      throw new NotFoundException(`Tag with ID ${tagId} not found`);
    }

    note.tags = note.tags?.filter((t) => t.id !== tagId) || [];
    return this.noteRepo.save(note);
  }
}
