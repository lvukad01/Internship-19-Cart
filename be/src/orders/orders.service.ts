import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderStatus } from '@prisma/client';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {

    constructor(private prisma: PrismaService) {}
  
  create(data: CreateOrderDto) {
    const { items, userId, ...orderData } = data;
    return this.prisma.order.create({
      data: {
        ...orderData,
        user: {
          connect: { id: userId },
        },
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }


  update(id: number, data: UpdateOrderDto) {
    return this.prisma.order.update({
      where: { id },
      data: {
        status:OrderStatus.CONFIRMED,
      },
       include: { items: {
        include: {
          product: true,
        },
      },
    }});
  }

  findMyOrders(userId: number) {

    return this.prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  remove(id: number) {
    return this.prisma.order.delete({
      where: { id },
    });
  }
}
