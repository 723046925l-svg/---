import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, RequestOtpDto, VerifyOtpDto } from './dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}
  @Post('register') register(@Body() dto: RegisterDto) { return this.auth.register(dto); }
  @Post('login') login(@Body() dto: LoginDto) { return this.auth.login(dto); }
  @Post('otp/request') requestOtp(@Body() dto: RequestOtpDto) { return this.auth.requestOtp(dto); }
  @Post('otp/verify') verifyOtp(@Body() dto: VerifyOtpDto) { return this.auth.verifyOtp(dto); }
}
