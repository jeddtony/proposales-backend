import { IsNumber, IsNotEmpty, Min } from 'class-validator';

export class CreateShoppingCartDto {
  @IsNumber({}, { message: 'User ID must be a valid number' })
  @IsNotEmpty({ message: 'User ID is required' })
  @Min(1, { message: 'User ID must be greater than 0' })
  public user_id: number;
}

export class AddBookToShoppingCartDto {
  @IsNumber()
  @IsNotEmpty()
  public user_id: number;

  @IsNumber({}, { message: 'Book ID must be a valid number' })
  @IsNotEmpty({ message: 'Book ID is required' })
  @Min(1, { message: 'Book ID must be greater than 0' })
  public book_id: number;
}

export class AddBookToShoppingCartRequestDto {
  @IsNumber({}, { message: 'Book ID must be a valid number' })
  @IsNotEmpty({ message: 'Book ID is required' })
  @Min(1, { message: 'Book ID must be greater than 0' })
  public book_id: number;
}
