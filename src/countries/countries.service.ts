import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Country } from './schemas/country.schema';
import type { CountryDocument } from './schemas/country.schema';
import { COUNTRY_INFO_PROVIDER } from './external/country-info-provider.interface';
import type { CountryInfoProvider } from './external/country-info-provider.interface';

@Injectable()
export class CountriesService {
  private readonly loadedFromExternal = new Set<string>();

  constructor(
    @InjectModel(Country.name)
    private readonly countryModel: Model<CountryDocument>,

    @Inject(COUNTRY_INFO_PROVIDER)
    private readonly externalProvider: CountryInfoProvider,
  ) {}

  async findAll(): Promise<CountryDocument[]> {
    return this.countryModel.find().exec();
  }

  async findByCodeWithCache(code: string): Promise<{
    country: CountryDocument;
    source: 'cache' | 'external';
  }> {
    const upperCode = code.toUpperCase();

    if (this.loadedFromExternal.has(upperCode)) {
      const existing = await this.countryModel
        .findOne({ code: upperCode })
        .exec();

      if (existing) {
        return { country: existing, source: 'cache' };
      }

      const external =
        await this.externalProvider.getCountryByAlpha3(upperCode);
      const created = await this.countryModel.create(external);
      return { country: created, source: 'cache' };
    }

    const external = await this.externalProvider.getCountryByAlpha3(upperCode);
    const created = await this.countryModel.create(external);

    this.loadedFromExternal.add(upperCode);

    return { country: created, source: 'external' };
  }
}
