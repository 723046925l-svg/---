import { BookingService } from './booking.service';

describe('BookingService', () => {
  it('throws on conflict', async () => {
    const svc = new BookingService({ appointment: { create: async () => { throw new Error('duplicate'); } } } as any, { log: async () => ({}) } as any);
    await expect(svc.create({} as any)).rejects.toThrow('Slot already booked');
  });
});
