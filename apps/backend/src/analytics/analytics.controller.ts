import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private prisma: PrismaService) {}
  @Get('summary')
  async summary() {
    const [bookings, paid, cancelled, users] = await Promise.all([
      this.prisma.appointment.count(),
      this.prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'PAID' } }),
      this.prisma.appointment.count({ where: { status: 'CANCELLED' } }),
      this.prisma.user.count(),
    ]);
    return { bookings, revenue: paid._sum.amount || 0, cancellations: cancelled, activeUsers: users };
  }
}
