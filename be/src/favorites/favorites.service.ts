import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoritesService {

  constructor(private prisma: PrismaService) {}

  async addToFavorites(userId: number, productId: number) {
    return this.prisma.favorite.create({
      data: {
        user: {
          connect: { id: userId }
        },
        product: {
          connect: { id: productId }
        },
      },
    });
  }

  findAll(userId: number) {
    return this.prisma.favorite.findMany({
      where: {
        userId,
      },
      include: {
        product: true,
      },
    });

}

  remove(id: number) {
    return this.prisma.favorite.delete({
      where: { id },
    });

  }
}
