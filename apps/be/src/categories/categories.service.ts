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
    return this.prisma.category.findMany();
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
      include: { _count: { select: { products: true } } }
    });

    if (category && category._count.products > 0) {
      throw new BadRequestException('Cannot delete category because it has products linked to it.');
    }

    return this.prisma.category.delete({
      where: { id },
    });
  }
}
