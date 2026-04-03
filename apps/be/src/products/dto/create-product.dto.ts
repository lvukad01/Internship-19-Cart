import { ApiProperty } from '@nestjs/swagger';
import { IsString, 
    IsNumber, IsArray, 
    IsBoolean, IsOptional, Min, Max, IsNotEmpty, 
    MinLength,
    MaxLength,
    ArrayMinSize,
    IsUrl
} from 'class-validator';


export class CreateProductDto {
    @ApiProperty({example: 'T-shirt'})
    @IsString()
    @IsNotEmpty()
    @MinLength(2, { message: 'Name is too short' })
    @MaxLength(100, { message: 'Name is too long' })
    name: string;


    @ApiProperty({example: 19.99})
    @IsNumber()
    @Min(0, { message: 'Price must be a positive number' })
    @Max(1000000, {message: 'Price is too high'})
    price: number;

    @ApiProperty({example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg']})
    @IsArray()
    @IsString({each: true})
    @ArrayMinSize(1, { message: 'Please provide at least one image' })
    images: string[];

    @ApiProperty({example: ['Blue', 'Red', 'Green'], required: false})
    @IsArray()
    @IsString({each: true})
    @ArrayMinSize(1, { message: 'Please provide at least one color' })
    colors: string[];


    @ApiProperty({example: 14, required:true})
    @IsNumber()
    @Min(0, { message: 'Stock must be a positive number' })
    stock: number;

    @ApiProperty({example:[ 'S', 'M', 'L', 'XL'], required: false})
    @IsArray()
    @IsString({each: true})
    @ArrayMinSize(1, { message: 'Please provide at least one size' })
    sizes: string[];

    @ApiProperty({ example: 1, description: 'ID postojeće kategorije iz baze' })
    @IsNumber()
    @IsNotEmpty()
    categoryId: number;

    @ApiProperty({example: new Date(), required: false})
    @IsOptional()
    createdAt?: Date;


}
