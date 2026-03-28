import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {

  constructor(private prisma: PrismaService) {}

  create(data: CreateProductDto) {
      const {  ...productData } = data;

    return this.prisma.product.create({
      data: {
        name: productData.name,
        description: productData.description ?? '',
        price: productData.price,
        images: productData.images,
        colors: productData.colors,
        brand: productData.brand ?? '',
        stock: productData.stock,
        sizes: productData.sizes,
        category: {
                connect: { id: data.categoryId }
              },        
        createdAt: productData.createdAt,
      },
    });
  }

  findAll() {
    return this.prisma.product.findMany({
      include: {
        category: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    const { categoryId, ...productData } = updateProductDto;

    return this.prisma.product.update({
      where: { id },
      data: {
        ...productData,
        category: categoryId ? { connect: { id: categoryId } } : undefined,
      },
    });

  }

  remove(id: number) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
