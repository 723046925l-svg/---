import { AuthService } from './auth.service';

describe('AuthService phone validation', () => {
  it('rejects non-Iraq numbers', async () => {
    const svc: any = new AuthService({}, {});
    expect(() => svc.validateIraqPhone('+12025550123')).toThrow();
  });
});
