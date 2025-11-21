import { Module } from '@nestjs/common';
import { TravelPlansService } from './travel-plans.service';
import { TravelPlansController } from './travel-plans.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TravelPlan } from './schemas/travel-plan.schema';
import { TravelPlanSchema } from './schemas/travel-plan.schema';
import { CountriesModule } from 'src/countries/countries.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TravelPlan.name, schema: TravelPlanSchema },
    ]),
    CountriesModule,
  ],
  providers: [TravelPlansService],
  controllers: [TravelPlansController],
})
export class TravelPlansModule {}
