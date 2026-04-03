import { IsString, IsNotEmpty, IsBoolean, IsNumber, Min, Max, IsOptional, Length } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @Length(1, 255, { message: 'Title must be between 1 and 255 characters' })
  public title: string;

  @IsString()
  @IsNotEmpty({ message: 'Author is required' })
  @Length(1, 255, { message: 'Author must be between 1 and 255 characters' })
  public author: string;

  @IsString()
  @IsNotEmpty({ message: 'Genre is required' })
  @Length(1, 100, { message: 'Genre must be between 1 and 100 characters' })
  public genre: string;

  @IsNumber({}, { message: 'Price must be a valid number' })
  @Min(0, { message: 'Price must be greater than or equal to 0' })
  @Max(999999, { message: 'Price must be less than 999999' })
  public price: number;

  @IsNumber({}, { message: 'Stock quantity must be a valid number' })
  @Min(0, { message: 'Stock quantity must be greater than or equal to 0' })
  @Max(999999, { message: 'Stock quantity must be less than 999999' })
  public stock_quantity: number;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  @Length(10, 1000, { message: 'Description must be between 10 and 1000 characters' })
  public description: string;
}

export class UpdateBookDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @Length(1, 255, { message: 'Title must be between 1 and 255 characters' })
  public title: string;

  @IsString()
  @IsNotEmpty({ message: 'Author is required' })
  @Length(1, 255, { message: 'Author must be between 1 and 255 characters' })
  public author: string;

  @IsString()
  @IsNotEmpty({ message: 'Genre is required' })
  @Length(1, 100, { message: 'Genre must be between 1 and 100 characters' })
  public genre: string;

  @IsBoolean()
  @IsNotEmpty({ message: 'Availability status is required' })
  public is_available: boolean;

  @IsNumber({}, { message: 'Price must be a valid number' })
  @Min(0, { message: 'Price must be greater than or equal to 0' })
  @Max(999999, { message: 'Price must be less than 999999' })
  public price: number;

  @IsNumber({}, { message: 'Stock quantity must be a valid number' })
  @Min(0, { message: 'Stock quantity must be greater than or equal to 0' })
  @Max(999999, { message: 'Stock quantity must be less than 999999' })
  public stock_quantity: number;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  @Length(10, 1000, { message: 'Description must be between 10 and 1000 characters' })
  public description: string;
}
