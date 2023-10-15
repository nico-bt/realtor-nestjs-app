import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHomeDto, UpdateHomeDto } from './dto/home.dto';
import { PropertyType } from '@prisma/client';
import { UserInfoJwt } from 'src/user/decorators/user.decorator';

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

  async getHomeById(id: number) {
    const home = await this.prismaService.home.findUnique({
      where: { id: +id },
    });
    if (!home) {
      throw new NotFoundException();
    }
    return home;
  }

  async createHome(body: CreateHomeDto, user: UserInfoJwt) {
    const home = await this.prismaService.home.create({
      data: {
        address: body.address,
        number_of_bedrooms: +body.number_of_bedrooms,
        number_of_bathrooms: +body.number_of_bathrooms,
        city: body.city,
        price: +body.price,
        land_size: +body.land_size,
        propertyType: PropertyType.RESIDENTIAL,
        user_id: user.id,
      },
    });

    const homeImages = body.images.map((image) => {
      return { ...image, home_id: home.id };
    });

    await this.prismaService.image.createMany({
      data: homeImages,
    });

    return home;
  }

  async updateHome(id: number, body: UpdateHomeDto, user: UserInfoJwt) {
    const home = await this.prismaService.home.findUnique({ where: { id } });

    if (!home) {
      throw new NotFoundException();
    }

    // Check ownership of home item
    if (home.user_id !== user.id) {
      throw new ForbiddenException();
    }

    const updatedHome = this.prismaService.home.update({
      where: { id },
      data: body,
    });

    return updatedHome;
  }

  async deleteHome(id: number, user: UserInfoJwt) {
    const home = await this.prismaService.home.findUnique({ where: { id } });
    if (!home) {
      throw new NotFoundException();
    }

    // Check ownership of home item
    if (home.user_id !== user.id) {
      throw new ForbiddenException();
    }

    // First delete the asociated images
    await this.prismaService.image.deleteMany({
      where: { home_id: id },
    });
    // Then delete the home
    const deletedHome = await this.prismaService.home.delete({
      where: { id },
    });

    return deletedHome;
  }
}
