import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHomeDto } from './dto/home.dto';
import { PropertyType } from '@prisma/client';

interface filterType {
  city?: string;
  price?: {
    gte?: number;
    lte?: number;
  };
  propertyType?: PropertyType;
}

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllHomes(filters: filterType) {
    const homes = await this.prismaService.home.findMany({
      select: {
        address: true,
        number_of_bathrooms: true,
        number_of_bedrooms: true,
        city: true,
        price: true,
        land_size: true,
        propertyType: true,
        user_id: true,
        images: { select: { url: true }, take: 1 },
      },
      where: filters,
    });

    return homes;
  }

  async getHomeById(id: string) {
    const home = await this.prismaService.home.findUnique({
      where: { id: +id },
    });
    if (!home) {
      throw new NotFoundException();
    }
    return home;
  }

  async createHome(body: CreateHomeDto) {
    console.log(body);
    const home = await this.prismaService.home.create({
      data: {
        address: body.address,
        number_of_bedrooms: +body.number_of_bedrooms,
        number_of_bathrooms: +body.number_of_bathrooms,
        city: body.city,
        price: +body.price,
        land_size: +body.land_size,
        propertyType: PropertyType.RESIDENTIAL,
        user_id: +9,
      },
    });
    return home;
  }

  async updateHome(id: string) {
    return 'update a home';
  }

  async deleteHome(id: string) {
    return 'Delete Home';
  }
}
