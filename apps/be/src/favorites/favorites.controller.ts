import { Controller, Get, Post, Param, Delete, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('favorites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) 
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':productId')
  @ApiOperation({ summary: 'Add product to favorites' })
  addToFavorites(
    @Param('productId', ParseIntPipe) productId: number,
    @Request() req
  ) {
    return this.favoritesService.addToFavorites(req.user.id, productId);
  }

  @Get()
  @ApiOperation({ summary: 'Get my favorite products' })
  findAll(@Request() req) {
    return this.favoritesService.findAll(req.user.id);
  }
  @Delete('product/:productId')
  @ApiOperation({ summary: 'Remove product from favorites using productId' })
  removeByProduct(
    @Param('productId', ParseIntPipe) productId: number,
    @Request() req
  ) {
    return this.favoritesService.removeByProduct(req.user.id, productId);
  }
}