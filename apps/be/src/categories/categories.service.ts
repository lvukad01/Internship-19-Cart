import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {

  constructor(private prisma: PrismaService) {}
  
  create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
      },
    });
  }
  findAll() {
    return this.prisma.category.findMany({
      include: {
        products: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.category.findUnique({
      where: { id },
    });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
      return this.prisma.category.update({
        where: { id },
        data: {
          name: updateCategoryDto.name,
        },
      });
  }

  async remove(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new BadRequestException('Kategorija nije pronađena.');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.product.deleteMany({
        where: { categoryId: id },
      });

      return tx.category.delete({
        where: { id },
      });
    });
  }
}
