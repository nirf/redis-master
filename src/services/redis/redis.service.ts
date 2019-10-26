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

  public set(input: {
    key: string,
    val: string,
    expInSeconds?: number
  }): boolean {
    if (input.expInSeconds) {
      this.client.set(input.key, input.val, 'EX', input.expInSeconds, redis.print)
    } else {
      this.client.set(input.key, input.val, redis.print)
    }

    return true
  }

}
