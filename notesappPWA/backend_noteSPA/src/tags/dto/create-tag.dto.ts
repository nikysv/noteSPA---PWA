import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

export class CreateTagDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 50)
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'color must be a valid hex color (e.g., #ff0000)',
  })
  color: string;
}
