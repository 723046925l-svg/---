import { describe, expect, it, vi } from 'vitest';
import { AuthService } from '../src/auth/auth.service';

describe('AuthService', () => {
  it('issues otp and tokens', async () => {
    process.env.DEMO_MODE = 'true';
    const prisma: any = {
      otpCode: { create: vi.fn(), findFirst: vi.fn().mockResolvedValue({ code: '000000', expiresAt: new Date(Date.now() + 5000) }) },
      user: { upsert: vi.fn().mockResolvedValue({ id: 'u1', role: 'PATIENT' }) },
      refreshToken: { create: vi.fn() },
    };
    const service = new AuthService(prisma);
    await service.requestOtp('+9647700000000');
    const tokens = await service.verifyOtp('+9647700000000', '000000');
    expect(tokens.accessToken).toBeTruthy();
    expect(tokens.refreshToken).toBeTruthy();
  });
});
