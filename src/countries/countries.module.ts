import { Module } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { Country } from './schemas/country.schema';
import { CountrySchema } from './schemas/country.schema';
import { COUNTRY_INFO_PROVIDER } from './external/country-info-provider.interface';
import { RestCountriesService } from './external/restcountries.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: Country.name, schema: CountrySchema }]),
  ],
  providers: [
    CountriesService,
    {
      provide: COUNTRY_INFO_PROVIDER,
      useClass: RestCountriesService,
    },
  ],
  controllers: [CountriesController],
  exports: [CountriesService],
})
export class CountriesModule {}
