import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'lana@example.com' })
  @IsEmail({}, { message: 'Please enter valid email format' })
  @MaxLength(50, { message: 'Email is too long (max 50 characters)' })
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  @MinLength(6, { message: 'Password should have at least 6 characters' })
  password: string;

  @ApiProperty({ example: 'Lana Ivić' })
  @IsNotEmpty()
  @MaxLength(30, { message: 'Name should have less than 30 characters' })
  @MinLength(2, { message: 'Name should have at least 2 characters' })
  @Matches(/^[a-zA-Z\s'-]+$/, {
    message: 'Invalid characters in name',
  })
  name: string;

  @ApiProperty({ example: '091 234 567', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9\s\-]{6,20}$/, { message: 'Invalid phone format' })
  phone?: string;

  @ApiProperty({ example: 'Ulica kralja Tomislava 10, Split', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  address?: string;
}