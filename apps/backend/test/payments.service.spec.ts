import { describe, expect, it } from 'vitest';
import { PaymentsService } from '../src/payments/payments.service';

describe('Payments webhook', () => {
  it('verifies mock signature', () => {
    const svc = new PaymentsService({} as any);
    expect(svc.verifyWebhook('mock-valid')).toBe(true);
    expect(svc.verifyWebhook('wrong')).toBe(false);
  });
});
