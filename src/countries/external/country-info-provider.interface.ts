export interface CountryInfoProvider {
  getCountryByAlpha3(code: string): Promise<{
    code: string;
    name: string;
    region: string;
    subregion: string;
    capital: string;
    population: number;
    flagUrl: string;
  }>;
}

export const COUNTRY_INFO_PROVIDER = 'COUNTRY_INFO_PROVIDER';
