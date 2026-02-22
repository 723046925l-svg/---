import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';

@Controller('notifications')
export class NotificationsController {
  constructor(private service: NotificationsService) {}
  @UseGuards(JwtAuthGuard)
  @Get('inbox') inbox(@Req() req: any) { return this.service.list(req.user.sub); }
}
