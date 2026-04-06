import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateContentDto {
  @IsNumber()
  public company_id: number;

  @IsString()
  @IsNotEmpty()
  public language: string;

  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsString()
  @IsOptional()
  public description?: string;

  @IsString()
  @IsOptional()
  public image_url?: string;
}
