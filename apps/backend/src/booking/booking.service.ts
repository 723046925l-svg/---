import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateBookingDto } from './booking.dto';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService, private audit: AuditService) {}

  async create(dto: CreateBookingDto, actorId?: string) {
    try {
      const created = await this.prisma.appointment.create({
        data: { ...dto, startAt: new Date(dto.startAt), endAt: new Date(dto.endAt) },
      });
      await this.audit.log({ actorId, action: 'APPOINTMENT_CREATED', entityType: 'Appointment', entityId: created.id, after: created });
      return created;
    } catch {
      throw new BadRequestException('Slot already booked for this doctor/time');
    }
  }

  list() { return this.prisma.appointment.findMany({ include: { doctor: true, clinic: true, payment: true } }); }
}
