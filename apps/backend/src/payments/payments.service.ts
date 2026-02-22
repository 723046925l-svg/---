import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}
  async pay(appointmentId: string, amount: number) {
    const provider = process.env.PAYMENT_PROVIDER || 'mock';
    const payment = await this.prisma.payment.upsert({ where: { appointmentId }, create: { appointmentId, amount, provider, status: 'PAID' }, update: { status: 'PAID', amount } });
    await this.prisma.appointment.update({ where: { id: appointmentId }, data: { paid: true } });
    return { redirectUrl: `/payments/success/${payment.id}`, payment };
  }
  verifyWebhook(signature: string) {
    if (!signature) throw new BadRequestException('Missing signature');
    return signature === 'mock-valid';
  }
}
