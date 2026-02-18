import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bullmq';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './common/prisma.service';
import { BookingModule } from './booking/booking.module';
import { PaymentsModule } from './payments/payments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { VideoModule } from './video/video.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 20 }]),
    BullModule.forRoot({ connection: { host: process.env.REDIS_HOST || 'redis', port: 6379 } }),
    AuthModule,
    BookingModule,
    PaymentsModule,
    NotificationsModule,
    VideoModule,
    AnalyticsModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
