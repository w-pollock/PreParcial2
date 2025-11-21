import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CountriesModule } from './countries/countries.module';
import { TravelPlansModule } from './travel-plans/travel-plans.module';
import { MiddlewareConsumer } from '@nestjs/common';
import { NestModule } from '@nestjs/common';
import { ApiLoggingMiddleware } from './extra/middleware/api-logging.middleware';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/travel-planner'),
    CountriesModule,
    TravelPlansModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiLoggingMiddleware).forRoutes('countries', 'travel-plans');
  }
}
