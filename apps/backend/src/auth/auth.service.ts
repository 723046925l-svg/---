import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { isValidPhoneNumber } from 'libphonenumber-js';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async requestOtp(phone: string) {
    if (!isValidPhoneNumber(phone, 'IQ') && !phone.startsWith('+964')) throw new BadRequestException('Invalid Iraqi phone number');
    const code = process.env.DEMO_MODE === 'true' ? '000000' : `${Math.floor(100000 + Math.random() * 900000)}`;
    await this.prisma.otpCode.create({ data: { target: phone, code, expiresAt: new Date(Date.now() + 5 * 60_000) } });
    return { success: true, code: process.env.DEMO_MODE === 'true' ? code : undefined };
  }

  async verifyOtp(phone: string, code: string, name = 'Patient Demo') {
    const otp = await this.prisma.otpCode.findFirst({ where: { target: phone }, orderBy: { createdAt: 'desc' } });
    if (!otp || otp.code !== code || otp.expiresAt < new Date()) throw new UnauthorizedException('OTP invalid');
    const user = await this.prisma.user.upsert({ where: { phone }, create: { phone, name, role: 'PATIENT' }, update: {} });
    return this.issueTokens(user.id, user.role);
  }

  async loginEmail(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user?.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) throw new UnauthorizedException('Invalid credentials');
    return this.issueTokens(user.id, user.role);
  }

  async refresh(refreshToken: string) {
    const decoded: any = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret');
    const stored = await this.prisma.refreshToken.findUnique({ where: { uniqueToken: decoded.jti } });
    if (!stored) throw new UnauthorizedException('Refresh invalid');
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: decoded.sub } });
    return this.issueTokens(user.id, user.role);
  }

  private async issueTokens(userId: string, role: string) {
    const accessToken = jwt.sign({ sub: userId, role }, process.env.JWT_SECRET || 'dev_jwt_secret', { expiresIn: process.env.JWT_EXPIRES_IN || '15m' });
    const jti = crypto.randomUUID();
    const refreshToken = jwt.sign({ sub: userId, role, jti }, process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret', { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' });
    await this.prisma.refreshToken.create({ data: { userId, token: refreshToken, uniqueToken: jti } });
    return { accessToken, refreshToken };
  }
}
