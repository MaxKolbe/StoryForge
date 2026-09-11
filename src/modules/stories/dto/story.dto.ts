import { Length, IsString, IsArray, ArrayNotEmpty, ArrayMinSize, ArrayMaxSize } from 'class-validator';

export class CreateStory {
  @Length(8, 32)
  topic: string;

  @IsArray()
  @IsString({ each: true, message: 'Each tag must be a string' })
  @ArrayNotEmpty() 
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @IsString({ each: true })
  characters: string[];
}
