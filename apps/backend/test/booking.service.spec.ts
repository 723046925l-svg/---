import { describe, expect, it, vi } from 'vitest';
import { BookingService } from '../src/booking/booking.service';

describe('BookingService conflict', () => {
  it('throws conflict on duplicate slot', async () => {
    const prisma: any = { appointment: { create: vi.fn().mockRejectedValue({ code: 'P2002' }) } };
    const audit: any = { log: vi.fn() };
    const svc = new BookingService(prisma, audit);
    await expect(svc.create({ clinicId: 'c', doctorId: 'd', patientId: 'p', startsAt: new Date().toISOString(), type: 'IN_CLINIC' })).rejects.toThrow('Slot already booked');
  });
});
