import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagRepo: Repository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto, userId: number): Promise<Tag> {
    try {
      const tag = this.tagRepo.create({
        ...createTagDto,
        userId,
      });
      return await this.tagRepo.save(tag);
    } catch (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
  }
  async findAll(userId: number): Promise<Tag[]> {
    try {
      return await this.tagRepo.find({
        where: { userId },
        relations: ['notes'],
      });
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw new Error(`Failed to fetch tags: ${error.message}`);
    }
  }
  async findOne(id: number): Promise<Tag> {
    const tag = await this.tagRepo.findOne({
      where: { id },
      relations: ['notes'],
    });

    if (!tag) {
      throw new NotFoundException(`Tag with ID "${id}" not found`);
    }

    return tag;
  }

  async update(id: number, updateTagDto: UpdateTagDto): Promise<Tag> {
    const tag = await this.findOne(id);

    Object.assign(tag, updateTagDto);
    return this.tagRepo.save(tag);
  }

  async remove(id: number): Promise<void> {
    const tag = await this.findOne(id);
    await this.tagRepo.remove(tag);
  }
}
