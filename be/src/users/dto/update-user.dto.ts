import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'Lana Ivić', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: '091 234 567', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'Ulica kralja Tomislava 10, Livno', required: false })
  @IsOptional()
  @IsString()
  address?: string;
}