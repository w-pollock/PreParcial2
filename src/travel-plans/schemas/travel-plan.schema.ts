import { Prop } from '@nestjs/mongoose';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TravelPlanDocument = TravelPlan & Document;

@Schema({ timestamps: { createdAt: 'createdAt' } })
export class TravelPlan {
  @Prop({ required: true })
  countryCode: string;

  @Prop({ required: true })
  title: string;

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date, required: true })
  endDate: Date;

  @Prop()
  notes?: string;
}

export const TravelPlanSchema = SchemaFactory.createForClass(TravelPlan);
