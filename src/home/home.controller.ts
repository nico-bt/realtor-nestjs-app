import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Put,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { HomeService } from './home.service';
import { CreateHomeDto, UpdateHomeDto } from './dto/home.dto';
import { PropertyType, UserType } from '@prisma/client';
import { User, UserInfoJwt } from 'src/user/decorators/user.decorator';
import { Roles } from 'src/decorators/roles.decorator';

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
  getHomeById(@Param('id', ParseIntPipe) id: number) {
    return this.homeService.getHomeById(id);
  }

  @Roles(UserType.BUYER, UserType.REALTOR)
  @Post()
  createHome(@Body() body: CreateHomeDto, @User() user: UserInfoJwt) {
    return this.homeService.createHome(body, user);
  }

  @Roles(UserType.BUYER, UserType.REALTOR)
  @Put(':id')
  updateHome(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateHomeDto,
    @User() user: UserInfoJwt,
  ) {
    return this.homeService.updateHome(id, body, user);
  }

  @Roles(UserType.BUYER, UserType.REALTOR)
  @Delete(':id')
  deleteHome(@Param('id', ParseIntPipe) id: number, @User() user: UserInfoJwt) {
    return this.homeService.deleteHome(id, user);
  }
}
