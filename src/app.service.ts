import { Injectable } from '@nestjs/common'
import { HealthcheckResponse } from './common/common'

const Quote = require('inspirational-quotes')

@Injectable()
export class AppService {
  healthCheck(): HealthcheckResponse {
    return Quote.getQuote()
  }
}
