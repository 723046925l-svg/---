import { Controller, Get, Param } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller()
export class AppController {
  constructor(private prisma: PrismaService) {}
  @Get('health') health() { return { ok: true }; }
  @Get('clinics') clinics() { return this.prisma.clinic.findMany({ include: { doctors: { include: { user: true, specialty: true } } } }); }
  @Get('doctors/:id') doctor(@Param('id') id: string) { return this.prisma.doctor.findUnique({ where: { id }, include: { user: true, clinic: true, specialty: true } }); }
}
