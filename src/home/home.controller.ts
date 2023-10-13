import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { HomeService } from './home.service';
import { CreateHomeDto } from './dto/home.dto';
import { PropertyType } from '@prisma/client';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  getAllHomes(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('propertyType') propertyType?: PropertyType,
  ) {
    // Construction of query filter
    // If a query param does not exists, return an empty obj
    const price =
      minPrice || maxPrice
        ? {
            ...(minPrice && { gte: +minPrice }),
            ...(maxPrice && { lte: +maxPrice }),
          }
        : undefined;

    const filters = {
      ...(city && { city }),
      ...(price && { price }),
      ...(propertyType && { propertyType }),
    };
    // console.log(filters);
    return this.homeService.getAllHomes(filters);
  }

  @Get(':id')
  getHomeById(@Param('id') id: string) {
    return this.homeService.getHomeById(id);
  }

  @Post()
  createHome(@Body() body: CreateHomeDto) {
    return this.homeService.createHome(body);
  }

  @Put(':id')
  updateHome(@Param('id') id: string) {
    return this.homeService.updateHome(id);
  }

  @Delete(':id')
  deleteHome(@Param('id') id: string) {
    return this.homeService.deleteHome(id);
  }
}
