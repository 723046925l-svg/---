import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { MockProvider, PaymentProvider, ZainCashProvider } from './payment.providers';

@Injectable()
export class PaymentsService {
  private provider: PaymentProvider;
  constructor(private prisma: PrismaService) {
    this.provider = (process.env.PAYMENT_PROVIDER || 'mock') === 'zaincash' ? new ZainCashProvider() : new MockProvider();
  }

  async create(appointmentId: string, amount: number) {
    const session = await this.provider.createPayment({ appointmentId, amount, currency: 'IQD', callbackUrl: 'http://localhost:3000/payments/webhook' });
    return this.prisma.payment.upsert({
      where: { appointmentId },
      update: { providerRef: session.providerRef, status: session.status === 'PAID' ? 'PAID' : 'PENDING' },
      create: { appointmentId, amount, provider: process.env.PAYMENT_PROVIDER || 'mock', providerRef: session.providerRef, status: session.status === 'PAID' ? 'PAID' : 'PENDING' },
    });
  }

  async webhook(signature: string, payload: any) {
    const ok = await this.provider.verifyWebhook(signature, payload);
    if (!ok) throw new BadRequestException('Invalid signature');
    const appointmentId = payload.appointmentId;
    return this.prisma.payment.update({ where: { appointmentId }, data: { status: payload.status === 'PAID' ? 'PAID' : 'FAILED', payload } });
  }
}
