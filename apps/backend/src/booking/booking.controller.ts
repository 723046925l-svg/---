import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';

@Controller('bookings')
export class BookingController {
  constructor(private booking: BookingService) {}
  @Get() list() { return this.booking.list(); }
  @UseGuards(JwtAuthGuard)
  @Post() create(@Body() body: any, @Req() req: any) { return this.booking.create(body, req.user, { ip: req.ip, ua: req.headers['user-agent'] }); }
  @UseGuards(JwtAuthGuard)
  @Patch(':id/status') status(@Param('id') id: string, @Body() body: { status: string }, @Req() req: any) { return this.booking.status(id, body.status, req.user); }
}
