import { IsString, IsEmail, IsNotEmpty, IsOptional, IsInt, IsNumber, IsDateString } from 'class-validator';

export class CreateProposalRequestDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public phone_number: string;

  @IsString()
  @IsNotEmpty()
  public company_name: string;

  @IsString()
  @IsNotEmpty()
  public details: string;

  @IsDateString()
  @IsOptional()
  public event_date?: string;

  @IsInt()
  @IsOptional()
  public guests?: number;

  @IsNumber()
  @IsOptional()
  public budget?: number;
}
