import { Type } from 'class-transformer';
import {
  Length,
  IsString,
  IsArray,
  ArrayNotEmpty,
  ArrayMinSize,
  ArrayMaxSize,
  IsOptional,
  IsIn,
  IsInt,
  Max,
  Min,
} from 'class-validator';

export class CreateStory {
  @Length(4, 80)
  topic: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @IsString({ each: true, message: 'Each tag must be a string' })
  characters: string[];
}
export class ListStories {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(25)
  limit: number;

  @IsIn(['asc', 'desc'])
  orderBy: 'asc' | 'desc';
}
