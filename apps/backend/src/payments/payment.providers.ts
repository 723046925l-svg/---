export interface CreatePaymentInput { appointmentId: string; amount: number; currency: string; callbackUrl: string; }
export interface PaymentProvider {
  createPayment(input: CreatePaymentInput): Promise<{ providerRef: string; redirectUrl?: string; status: 'PENDING' | 'PAID' }>;
  verifyWebhook(signature: string, payload: unknown): Promise<boolean>;
}

export class MockProvider implements PaymentProvider {
  async createPayment() { return { providerRef: `mock_${Date.now()}`, status: 'PAID' as const }; }
  async verifyWebhook() { return true; }
}

export class ZainCashProvider implements PaymentProvider {
  async createPayment(input: CreatePaymentInput) {
    return { providerRef: `zain_${Date.now()}`, redirectUrl: `https://gateway.example/pay/${input.appointmentId}`, status: 'PENDING' as const };
  }
  async verifyWebhook(signature: string) {
    // TODO: replace with real HMAC signature verification from ZainCash docs.
    return !!signature;
  }
}
