import { Body, Controller, Headers, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private payments: PaymentsService) {}
  @Post(':appointmentId') create(@Param('appointmentId') appointmentId: string, @Body('amount') amount: number) { return this.payments.create(appointmentId, amount); }
  @Post('webhook') webhook(@Headers('x-signature') signature: string, @Body() payload: any) { return this.payments.webhook(signature, payload); }
}
