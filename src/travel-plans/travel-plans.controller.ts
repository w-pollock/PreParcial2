import { Controller } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { TravelPlansService } from './travel-plans.service';
import { CreateTravelPlanDto } from './dto/create-travel-plan.dto';

@Controller('travel-plans')
export class TravelPlansController {
  constructor(private readonly travelPlansService: TravelPlansService) {}

  @Post()
  async create(@Body() dto: CreateTravelPlanDto) {
    return this.travelPlansService.create(dto);
  }

  @Get()
  async findAll() {
    return this.travelPlansService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.travelPlansService.findOne(id);
  }
}
