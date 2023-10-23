import { Test, TestingModule } from '@nestjs/testing';
import { HomeService } from './home.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PropertyType } from '@prisma/client';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';

const mockResponseGetAllHomes = [
  {
    id: 1,
    address: 'PARAGUAY 631',
    number_of_bathrooms: 1,
    number_of_bedrooms: 2,
    city: 'Buenos Aires',
    price: 8400,
    land_size: 64,
    propertyType: 'RESIDENTIAL',
    user_id: 9,
    images: [{ url: 'url1' }],
  },
];

const mockHome = {
  id: 1,
  address: 'PARAGUAY 631',
  number_of_bathrooms: 1,
  number_of_bedrooms: 2,
  city: 'Buenos Aires',
  price: 8400,
  land_size: 64,
  propertyType: 'RESIDENTIAL',
};
const mockImages = [{ url: 'src1' }, { url: 'src2' }];

describe('HomeService', () => {
  let service: HomeService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HomeService,
        {
          provide: PrismaService,
          useValue: {
            home: {
              findMany: jest.fn().mockReturnValue(mockResponseGetAllHomes),
              findUnique: jest.fn().mockReturnValue(mockResponseGetAllHomes[0]),
              create: jest.fn().mockReturnValue(mockHome),
            },
            image: {
              createMany: jest.fn().mockReturnValue(mockImages),
            },
          },
        },
      ],
    }).compile();

    service = module.get<HomeService>(HomeService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllHomes', () => {
    it('should call prisma home.findMany with the correct parameters', async () => {
      const mockPrismaFindManyHomes = jest
        .fn()
        .mockReturnValue(mockResponseGetAllHomes);

      jest
        .spyOn(prismaService.home, 'findMany')
        .mockImplementation(mockPrismaFindManyHomes);

      const filters = {
        city: 'Ottawa',
        price: { gte: 10, lte: 62000 },
        propertyType: PropertyType.RESIDENTIAL,
      };

      await service.getAllHomes(filters);

      expect(mockPrismaFindManyHomes).toBeCalledWith({
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
    });
  });

  describe('getHomeById', () => {
    it('should call the prisma home.findUnique with the id that is passed', async () => {
      const mockPrismaFindById = jest
        .fn()
        .mockReturnValue(mockResponseGetAllHomes[0]);

      jest
        .spyOn(prismaService.home, 'findUnique')
        .mockImplementation(mockPrismaFindById);

      await service.getHomeById(6);

      expect(mockPrismaFindById).toBeCalledWith({ where: { id: 6 } });
    });

    it('should throw an error if no home is found', async () => {
      const mockPrismaFindById = jest.fn().mockReturnValue(null);

      jest
        .spyOn(prismaService.home, 'findUnique')
        .mockImplementation(mockPrismaFindById);

      await expect(service.getHomeById(8000)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('Create Home', () => {
    it('Should call prisma home.create with the correct payload', async () => {
      const mockPrismaHomeCreate = jest.fn().mockReturnValue(mockHome);

      jest
        .spyOn(prismaService.home, 'create')
        .mockImplementation(mockPrismaHomeCreate);

      const user = { id: 1, mail: 'user@mail.com' };
      const body = { ...mockHome, images: mockImages };

      await service.createHome(body, user);

      expect(mockPrismaHomeCreate).toBeCalledWith({
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
    });

    it('should call prisma image.createMany with the correct payload', async () => {
      const mockPrismaCreateMany = jest.fn().mockReturnValue(mockImages);

      jest
        .spyOn(prismaService.image, 'createMany')
        .mockImplementation(mockPrismaCreateMany);

      const user = { id: 1, mail: 'user@mail.com' };
      const body = { ...mockHome, images: mockImages };

      await service.createHome(body, user);

      expect(mockPrismaCreateMany).toBeCalledWith({
        data: [
          { url: mockImages[0].url, home_id: mockHome.id },
          { url: mockImages[1].url, home_id: mockHome.id },
        ],
      });
    });
  });
});
