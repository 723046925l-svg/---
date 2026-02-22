import { Controller, Param, Post } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Controller('video')
export class VideoController {
  constructor(private prisma: PrismaService) {}
  @Post('token/:appointmentId')
  async token(@Param('appointmentId') appointmentId: string) {
    const hasAgora = !!(process.env.AGORA_APP_ID && process.env.AGORA_APP_CERTIFICATE);
    const channelName = `appt_${appointmentId}`;
    const token = hasAgora ? `agora-token-${appointmentId}` : null;
    await this.prisma.videoSession.upsert({ where: { appointmentId }, create: { appointmentId, channelName, token }, update: { channelName, token } });
    return { channelName, token, mode: hasAgora ? 'agora' : 'mock' };
  }
}
