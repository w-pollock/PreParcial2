import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TravelPlan } from './schemas/travel-plan.schema';
import { TravelPlanDocument } from './schemas/travel-plan.schema';
import { CreateTravelPlanDto } from './dto/create-travel-plan.dto';
import { CountriesService } from 'src/countries/countries.service';

@Injectable()
export class TravelPlansService {
  constructor(
    @InjectModel(TravelPlan.name)
    private readonly travelPlanModel: Model<TravelPlanDocument>,
    private readonly countriesService: CountriesService,
  ) {}

  async create(dto: CreateTravelPlanDto): Promise<TravelPlan> {
    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);

    if (start > end) {
      throw new BadRequestException(
        'startDate must be before or equal to endDate',
      );
    }

    await this.countriesService.findByCodeWithCache(dto.countryCode);

    const plan = new this.travelPlanModel({
      countryCode: dto.countryCode.toUpperCase(),
      title: dto.title,
      startDate: start,
      endDate: end,
      notes: dto.notes,
    });

    return plan.save();
  }

  async findAll(): Promise<TravelPlan[]> {
    return this.travelPlanModel.find().exec();
  }

  async findOne(id: string): Promise<TravelPlan> {
    const plan = await this.travelPlanModel.findById(id).exec();

    if (!plan) {
      throw new NotFoundException(`Travel plan with id ${id} not found`);
    }

    return plan;
  }
}
