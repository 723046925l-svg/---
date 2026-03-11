import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { PrismaService } from '../common/prisma.service';
import { AuditService } from '../audit/audit.service';

@Module({ controllers: [BookingController], providers: [BookingService, PrismaService, AuditService], exports: [BookingService] })
export class BookingModule {}
