import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common'
import { AppService } from './app.service'
import { HealthcheckResponse, ServerResponse } from './common/common'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get()
  healthCheck(): ServerResponse<HealthcheckResponse> {
    return {
      err: 0,
      msg: 'Return healthcheck successfully',
      data: this.appService.healthCheck(),
    }
  }
}
