import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('otp/request') requestOtp(@Body() body: { phone: string }) { return this.auth.requestOtp(body.phone); }
  @Post('otp/verify') verifyOtp(@Body() body: { phone: string; code: string; name?: string }) { return this.auth.verifyOtp(body.phone, body.code, body.name); }
  @Post('login') login(@Body() body: { email: string; password: string }) { return this.auth.loginEmail(body.email, body.password); }
  @Post('refresh') refresh(@Body() body: { refreshToken: string }) { return this.auth.refresh(body.refreshToken); }
}
