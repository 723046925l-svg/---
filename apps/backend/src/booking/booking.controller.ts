import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../rbac/roles.guard';
import { Roles } from '../rbac/roles.decorator';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './booking.dto';

@ApiTags('bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('bookings')
export class BookingController {
  constructor(private booking: BookingService) {}
  @Roles('PATIENT', 'RECEPTIONIST', 'CLINIC_ADMIN', 'SUPER_ADMIN')
  @Post() create(@Body() dto: CreateBookingDto, @Req() req: any) { return this.booking.create(dto, req.user.userId); }
  @Get() list() { return this.booking.list(); }
}
