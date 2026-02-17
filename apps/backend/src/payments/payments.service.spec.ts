import { PaymentsService } from './payments.service';

describe('PaymentsService webhook', () => {
  it('rejects missing signature', async () => {
    process.env.PAYMENT_PROVIDER = 'zaincash';
    const svc = new PaymentsService({ payment: { update: async () => ({}) } } as any);
    await expect(svc.webhook('', { appointmentId: 'a1', status: 'PAID' })).rejects.toThrow('Invalid signature');
  });
});
