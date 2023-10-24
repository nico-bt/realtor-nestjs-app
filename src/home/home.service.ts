import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateHomeDto,
  HomeResponseDto,
  MessageResponseDto,
  MessagesByHomeResponseDto,
  UpdateHomeDto,
} from './dto/home.dto';
import { Home, PropertyType } from '@prisma/client';
import { UserInfoJwt } from 'src/user/decorators/user.decorator';

interface filterType {
  city?: string;
  price?: {
    gte?: number;
    lte?: number;
  };
  propertyType?: PropertyType;
}

const selectHomeData = {
  id: true,
  address: true,
  number_of_bedrooms: true,
  number_of_bathrooms: true,
  city: true,
  listed_date: true,
  price: true,
  land_size: true,
  propertyType: true,
  images: { select: { url: true } },
  user: { select: { email: true, name: true } },
};

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllHomes(filters: filterType): Promise<HomeResponseDto[]> {
    const homes = await this.prismaService.home.findMany({
      select: selectHomeData,
      where: filters,
    });

    return homes;
  }

  async getHomeById(id: number): Promise<HomeResponseDto> {
    const home = await this.prismaService.home.findUnique({
      where: { id: +id },
      select: selectHomeData,
    });
    if (!home) {
      throw new NotFoundException();
    }
    return home;
  }

  async createHome(
    body: CreateHomeDto,
    user: UserInfoJwt,
  ): Promise<HomeResponseDto> {
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
      select: selectHomeData,
    });

    const homeImages = body.images.map((image) => {
      return { ...image, home_id: home.id };
    });

    await this.prismaService.image.createMany({
      data: homeImages,
    });

    return home;
  }

  async updateHome(
    id: number,
    body: UpdateHomeDto,
    user: UserInfoJwt,
  ): Promise<HomeResponseDto> {
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
      select: selectHomeData,
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

  async inquire(
    homeId: number,
    message: string,
    userId: number,
  ): Promise<MessageResponseDto> {
    const home = await this.prismaService.home.findUnique({
      where: { id: homeId },
    });

    if (!home) {
      throw new NotFoundException('Not Found. Verify the home id');
    }

    const newMessage = await this.prismaService.message.create({
      data: {
        message,
        realtor_id: home.user_id,
        buyer_id: userId,
        home_id: homeId,
      },
    });
    return newMessage;
  }

  async getMessagesByHomeId(
    homeId: number,
  ): Promise<MessagesByHomeResponseDto[]> {
    const messages = await this.prismaService.message.findMany({
      where: { home_id: homeId },
      select: {
        message: true,
        home: { select: { id: true, address: true } },
        buyer: { select: { email: true, name: true, phone: true } },
      },
    });
    return messages;
  }
}
