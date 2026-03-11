import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class VideoService {
  constructor(private prisma: PrismaService) {}

  async createSession(appointmentId: string) {
    const channelName = `appointment_${appointmentId}`;
    return this.prisma.videoSession.upsert({
      where: { appointmentId },
      update: { channelName },
      create: { appointmentId, channelName },
    });
  }

  async generateJoinPayload(appointmentId: string, uid: string) {
    const session = await this.createSession(appointmentId);
    return {
      channelName: session.channelName,
      uid,
      appId: process.env.AGORA_APP_ID,
      message: 'Tokenless mode enabled by business decision #3, use Agora temp auth strategy.',
    };
  }
}
