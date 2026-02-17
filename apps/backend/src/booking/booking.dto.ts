import { IsDateString, IsEnum, IsString } from 'class-validator';
import { AppointmentType } from '@prisma/client';

export class CreateBookingDto {
  @IsString() clinicId!: string;
  @IsString() doctorId!: string;
  @IsString() patientId!: string;
  @IsEnum(AppointmentType) type!: AppointmentType;
  @IsDateString() startAt!: string;
  @IsDateString() endAt!: string;
}
