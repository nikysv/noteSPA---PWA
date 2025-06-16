import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesModule } from './notes/notes.module';
import { TagsModule } from './tags/tags.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: false, // cambia a true solo en desarrollo
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    NotesModule,
    TagsModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
