import { Controller, Get, ParseIntPipe, Query } from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { PaymentService } from "./payment.service.js";

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
    constructor(private paymentService: PaymentService) { }

    @Get()
    @ApiQuery({ name: 'year', type: Number, example: 2026 })
    getDisbursementByYear(@Query('year', ParseIntPipe) year: number) {
        return this.paymentService.getDisbursementByYear(year);
    }
}
