import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':productId')
  addToFavorites(@Param('productId') productId: string) {
    const userId = 1; 
    return this.favoritesService.addToFavorites(userId, +productId);
  }
 

  @Get()
  findAll(@Param('userId') userId: string) {
    return this.favoritesService.findAll(+userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.favoritesService.remove(+id);
  }
}
