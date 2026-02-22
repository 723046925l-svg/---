import { Body, Controller, Param, Post, Headers } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private service: PaymentsService) {}
  @Post(':appointmentId/pay') pay(@Param('appointmentId') appointmentId: string, @Body() body: { amount: number }) { return this.service.pay(appointmentId, body.amount); }
  @Post('webhook/zaincash') webhook(@Headers('x-signature') signature: string, @Body() body: any) {
    return { verified: this.service.verifyWebhook(signature), todo: 'Replace with HMAC verification', body };
  }
}
