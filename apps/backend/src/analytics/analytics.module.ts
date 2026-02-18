import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { PrismaService } from '../common/prisma.service';

@Module({ controllers: [AnalyticsController], providers: [PrismaService] })
export class AnalyticsModule {}
