import { Controller } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { Delete } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { AdminTokenGuard } from './guards/admin-token.guard';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  async findAll() {
    return this.countriesService.findAll();
  }

  @Get(':code')
  async findOne(@Param('code') code: string) {
    const { country, source } =
      await this.countriesService.findByCodeWithCache(code);

    return { source, country };
  }

  @UseGuards(AdminTokenGuard)
  @Delete(':code')
  delete(@Param('code') code: string) {
    return this.countriesService.deleteFromCache(code);
  }
}
