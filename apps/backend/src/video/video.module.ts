import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { PrismaService } from '../common/prisma.service';

@Module({ controllers: [VideoController], providers: [VideoService, PrismaService] })
export class VideoModule {}
