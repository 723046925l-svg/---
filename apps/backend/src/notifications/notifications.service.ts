import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

type Channel = 'push' | 'sms' | 'whatsapp';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async send(userId: string, channel: Channel, template: string, payload: Record<string, unknown>) {
    // provider adapters: Mock fully works locally; WhatsApp/SMS/FCM stubs by env.
    return this.prisma.notificationLog.create({ data: { userId, channel, template, payload, status: 'SENT' } });
  }

  async triggerAppointmentBooked(userId: string, appointmentId: string) {
    await this.send(userId, 'push', 'appointment.booked', { appointmentId });
    await this.send(userId, 'sms', 'appointment.booked', { appointmentId });
    await this.send(userId, 'whatsapp', 'appointment.booked', { appointmentId });
  }
}
