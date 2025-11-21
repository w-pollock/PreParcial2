import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CountriesModule } from './countries/countries.module';
import { TravelPlansModule } from './travel-plans/travel-plans.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/travel-planner'),
    CountriesModule,
    TravelPlansModule,
  ],
})
export class AppModule {}
