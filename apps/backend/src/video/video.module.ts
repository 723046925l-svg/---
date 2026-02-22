import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { PrismaService } from '../prisma.service';
@Module({ controllers: [VideoController], providers: [PrismaService] })
export class VideoModule {}
