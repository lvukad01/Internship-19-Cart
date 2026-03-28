import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateCategoryDto {
    @ApiProperty({example: 'Clothing'})
    @IsString()
    @IsNotEmpty()
    @MinLength(2, { message: 'Name is too short' })
    @MaxLength(100, { message: 'Name is too long' })
    name: string;


}
