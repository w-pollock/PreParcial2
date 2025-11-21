import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { CountryInfoProvider } from './country-info-provider.interface';

interface RestCountryApi {
  cca3: string;
  name?: { common?: string };
  region?: string;
  subregion?: string;
  capital?: string[];
  population?: number;
  flags?: { png?: string; svg?: string };
}

@Injectable()
export class RestCountriesService implements CountryInfoProvider {
  private readonly baseUrl = 'https://restcountries.com/v3.1';

  constructor(private readonly httpService: HttpService) {}

  async getCountryByAlpha3(code: string) {
    const url = `${this.baseUrl}/alpha/${code}`;

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<RestCountryApi | RestCountryApi[]>(url, {
          params: {
            fields: 'cca3,name,region,subregion,capital,population,flags',
          },
        }),
      );

      const country: RestCountryApi | undefined = Array.isArray(data)
        ? data[0]
        : data;

      if (!country) {
        throw new NotFoundException(
          `Country ${code} not found in RestCountries`,
        );
      }

      return {
        code: country.cca3,
        name: country.name?.common ?? '',
        region: country.region ?? '',
        subregion: country.subregion ?? '',
        capital: country.capital?.[0] ?? '',
        population: country.population ?? 0,
        flagUrl: country.flags?.png ?? country.flags?.svg ?? '',
      };
    } catch (error) {
      console.error('Error llamando a RestCountries:', code, error);
      throw new NotFoundException(`Country ${code} not found in RestCountries`);
    }
  }
}
