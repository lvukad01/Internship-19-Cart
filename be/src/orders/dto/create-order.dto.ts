import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsString, IsArray, Min, Max, IsEnum } from "class-validator";
import { OrderStatus, PaymentMethod } from "@prisma/client"; // Uvezi direktno iz Prisme

export class CreateOrderDto {
    @ApiProperty({ example: "Marko Marić" })
    @IsString()
    @IsNotEmpty()
    customerName: string;

    @ApiProperty({ example: "091234567" })
    @IsString()
    @IsNotEmpty()
    customerPhone: string;

    @ApiProperty({ example: "Ulica kralja Tomislava 1, Livno" })
    @IsString()
    @IsNotEmpty()
    shippingAddress: string;

    @ApiProperty({ example: false })
    @IsBoolean()
    isCompleted: boolean;

    @ApiProperty({ example: 23.33 })
    @IsNumber()
    @Min(0)
    subTotal: number;

    @ApiProperty({ example: 4.55 })
    @IsNumber()
    @Min(0)
    deliveryPrice: number;

    @ApiProperty({ example: 27.88 })
    @IsNumber()
    totalPrice: number;

    @ApiProperty({ enum: PaymentMethod, example: 'CARD' })
    @IsEnum(PaymentMethod)
    paymentMethod: PaymentMethod;

    @ApiProperty({ example: 'Pickup' })
    @IsString()
    deliveryMethod: string;

    @ApiProperty({ enum: OrderStatus, example: 'PENDING' })
    @IsEnum(OrderStatus)
    status: OrderStatus;

    @ApiProperty({ example: [{ productId: 1, quantity: 2, price: 19.99 }] })
    @IsArray()
    items: {
        productId: number;
        quantity: number;
        price: number;
    }[];

    @ApiProperty({ example: 1, description: 'ID of the user placing the order' })
    @IsNumber()
    userId: number;

}