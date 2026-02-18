import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../common/prisma.service';
import { LoginDto, RegisterDto, RequestOtpDto, VerifyOtpDto } from './dto';
import * as argon2 from 'argon2';
import { parsePhoneNumberWithError } from 'libphonenumber-js';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  private validateIraqPhone(phone: string) {
    const parsed = parsePhoneNumberWithError(phone);
    if (parsed.countryCallingCode !== '964') throw new BadRequestException('Only +964 numbers allowed');
  }

  async register(dto: RegisterDto) {
    if (dto.phone) this.validateIraqPhone(dto.phone);
    const passwordHash = await argon2.hash(dto.password);
    const user = await this.prisma.user.create({
      data: { ...dto, passwordHash, role: 'PATIENT' },
    });
    return this.tokens(user.id, user.role);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({ where: { OR: [{ email: dto.email }, { phone: dto.phone }] } });
    if (!user || !user.passwordHash) throw new UnauthorizedException('Invalid credentials');
    const valid = await argon2.verify(user.passwordHash, dto.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    return this.tokens(user.id, user.role);
  }

  async requestOtp(dto: RequestOtpDto) {
    this.validateIraqPhone(dto.phone);
    const code = '123456';
    await this.prisma.otpCode.create({ data: { phone: dto.phone, code, expiresAt: new Date(Date.now() + 5 * 60_000) } });
    return { sent: true, provider: 'mock' };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const otp = await this.prisma.otpCode.findFirst({ where: { phone: dto.phone, code: dto.code, usedAt: null } });
    if (!otp || otp.expiresAt < new Date()) throw new UnauthorizedException('Invalid OTP');
    await this.prisma.otpCode.update({ where: { id: otp.id }, data: { usedAt: new Date() } });
    let user = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
    if (!user) user = await this.prisma.user.create({ data: { phone: dto.phone, name: 'Patient', role: 'PATIENT' } });
    return this.tokens(user.id, user.role);
  }

  private async tokens(userId: string, role: string) {
    const accessToken = await this.jwt.signAsync({ sub: userId, role }, { expiresIn: '15m' });
    const refreshToken = await this.jwt.signAsync({ sub: userId, role, type: 'refresh' }, { expiresIn: '7d' });
    await this.prisma.refreshToken.create({
      data: { userId, tokenHash: await argon2.hash(refreshToken), expiresAt: new Date(Date.now() + 7 * 86400_000) },
    });
    return { accessToken, refreshToken };
  }
}
