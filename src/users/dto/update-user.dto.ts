import { IsOptional, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;
}