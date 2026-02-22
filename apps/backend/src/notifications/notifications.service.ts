import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma.service';

@Injectable()
export class NotificationsService {
  private queue = new Queue('notifications', { connection: { url: process.env.REDIS_URL || 'redis://localhost:6379' } as any });
  constructor(private prisma: PrismaService) {}

  async createAndQueue(userId: string, type: 'OTP' | 'BOOKED') {
    const payload = type === 'OTP'
      ? { titleAr: 'رمز الدخول', bodyAr: 'رمزك هو 000000', titleEn: 'OTP', bodyEn: 'Your OTP is 000000' }
      : { titleAr: 'تم الحجز', bodyAr: 'تم إنشاء الحجز بنجاح', titleEn: 'Booked', bodyEn: 'Your appointment is booked' };
    const notif = await this.prisma.notification.create({ data: { userId, ...payload, channel: 'IN_APP' } });
    await this.queue.add('notify', { id: notif.id });
    return notif;
  }

  list(userId: string) { return this.prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }); }
}
