import { IsNumber, IsNotEmpty, IsDate, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsNumber({}, { message: 'User ID must be a valid number' })
  @IsNotEmpty({ message: 'User ID is required' })
  @Min(1, { message: 'User ID must be greater than 0' })
  public user_id: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Order date must be a valid date' })
  public order_date?: Date;
}
