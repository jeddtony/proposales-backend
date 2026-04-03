import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateOrderItemsDto {
  @IsNumber()
  @IsNotEmpty()
  public order_id: number;

  @IsNumber()
  @IsNotEmpty()
  public book_id: number;

  @IsNumber()
  @IsNotEmpty()
  public quantity: number;

  @IsNumber()
  @IsNotEmpty()
  public price_at_purchase: number;
}