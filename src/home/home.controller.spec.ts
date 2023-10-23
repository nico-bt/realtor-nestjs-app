import { Test, TestingModule } from '@nestjs/testing';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PropertyType } from '@prisma/client';

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

describe('HomeController', () => {
  let controller: HomeController;
  let service: HomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomeController],
      providers: [
        {
          provide: HomeService,
          useValue: {
            getAllHomes: jest.fn().mockReturnValue(mockResponseGetAllHomes),
          },
        },
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    controller = module.get<HomeController>(HomeController);
    service = module.get<HomeService>(HomeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllHomes', () => {
    it('should construct the query with the passed data correctly', async () => {
      const filters = {
        city: 'Toronto',
        price: { gte: 150000 },
      };
      const mockGetHomes = jest.fn().mockReturnValue(mockResponseGetAllHomes);

      jest.spyOn(service, 'getAllHomes').mockImplementation(mockGetHomes);

      await controller.getAllHomes('Toronto', '150000');

      expect(mockGetHomes).toBeCalledWith(filters);
    });
  });
});
