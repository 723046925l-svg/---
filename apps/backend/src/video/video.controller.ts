import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VideoService } from './video.service';

@ApiTags('video')
@Controller('video')
export class VideoController {
  constructor(private video: VideoService) {}
  @Get('join/:appointmentId') join(@Param('appointmentId') appointmentId: string, @Query('uid') uid: string) {
    return this.video.generateJoinPayload(appointmentId, uid || '0');
  }
}
