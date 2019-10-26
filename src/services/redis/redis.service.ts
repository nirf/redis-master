import { Injectable } from '@nestjs/common'
import { ConfigService } from '../../config/config.service'

const redis = require('redis')

@Injectable()
export class RedisService {
  private client

  constructor(private readonly configService: ConfigService) {
    this.client = redis.createClient(this.configService.redisConfig)

    this.client.on('error', err => {
      console.error(`Redis error: ${err}`)
    })

    this.client.on('reconnecting', () => {
      console.warn('Redis is reconnecting')
    })

    this.client.on('connect', () => {
      console.log('Redis is connected')
    })

    this.client.on('ready', () => {
      console.log('Redis is ready')
    })
  }

  public set(input: any) {
    this.client.set('Nir', JSON.stringify(input), redis.print)
  }

}
