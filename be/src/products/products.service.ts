import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        name: data.name,
        description: data.description ?? '',
        price: data.price,
        images: data.images,
        colors: data.colors,
        brand: data.brand ?? '',
        stock: data.stock,
        sizes: data.sizes,
        category: {
          connect: { id: data.categoryId },
        },
      },
    });
  }

  async findAll(page: number, limit: number, search?: string, categoryId?: number) {
    const skip = (page - 1) * limit;

    return this.prisma.product.findMany({
      skip,
      take: limit,
      where: {
        OR: search ? [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ] : undefined,
        categoryId: categoryId ? categoryId : undefined,
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc', 
      },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) throw new NotFoundException(`Product with ID ${id} not found`);
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { categoryId, ...productData } = updateProductDto;

    return this.prisma.product.update({
      where: { id },
      data: {
        ...productData,
        category: categoryId ? { connect: { id: categoryId } } : undefined,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.product.delete({
      where: { id },
    });
  }
}