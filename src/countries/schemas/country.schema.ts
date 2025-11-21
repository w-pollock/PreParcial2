import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Country {
  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  region: string;

  @Prop()
  subregion: string;

  @Prop()
  capital: string;

  @Prop()
  population: number;

  @Prop()
  flagUrl: string;
}

export type CountryDocument = Country & Document;

export const CountrySchema = SchemaFactory.createForClass(Country);

CountrySchema.index({ code: 1 });
