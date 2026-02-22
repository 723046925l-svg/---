import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService, private audit: AuditService) {}

  list() { return this.prisma.appointment.findMany({ include: { clinic: true, patient: true, doctor: true, payment: true } }); }

  async create(input: { clinicId: string; doctorId: string; patientId: string; startsAt: string; type: 'IN_CLINIC' | 'VIDEO' }, actor?: any, meta?: any) {
    const startsAt = new Date(input.startsAt);
    const endsAt = new Date(startsAt.getTime() + 30 * 60_000);
    try {
      const appointment = await this.prisma.appointment.create({ data: { ...input, startsAt, endsAt } });
      await this.audit.log({ actorId: actor?.sub, role: actor?.role, action: 'BOOK_APPOINTMENT', entity: 'Appointment', entityId: appointment.id, after: appointment, ip: meta?.ip, userAgent: meta?.ua });
      return appointment;
    } catch (e: any) {
      if (e.code === 'P2002') throw new ConflictException('Slot already booked');
      throw e;
    }
  }

  async status(id: string, status: any, actor?: any) {
    const before = await this.prisma.appointment.findUniqueOrThrow({ where: { id } });
    const updated = await this.prisma.appointment.update({ where: { id }, data: { status } });
    await this.audit.log({ actorId: actor?.sub, role: actor?.role, action: 'UPDATE_APPOINTMENT', entity: 'Appointment', entityId: id, before, after: updated });
    return updated;
  }
}
