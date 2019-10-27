import { Injectable } from '@nestjs/common'
import { ConfigService } from '../../config/config.service'
import * as utils from '../../utils/utils'

const redis = require('redis')

@Injectable()
export class RedisService {
  private client
  private subClient

  constructor(private readonly configService: ConfigService) {
    this.client = redis.createClient(this.configService.redisConfig)
    this.subClient = this.client.duplicate()

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
      // setting Redis Keyspace Notifications which is disabled by default
      // listen to
      // E Keyevent events, published with __keyevent@<db>__ prefix.
      // x Expired events (events generated every time a key expires)
      this.client.config('SET', 'notify-keyspace-events', 'Ex')
      // lets check to see if there where message that should have been printed to screen
      // while the server was down
      this.client.keys('opaque:*', (err, keys) => {
        if (keys && keys.length) {
          for (const key of keys) {
            this.getAndDelAndEchoMessage(key)
          }
        }
      })
    })

    this.subClient.on('pmessage', (pattern, channel, message) => {
      const key = utils.generateOpaqueKey(message)
      this.getAndDelAndEchoMessage(key)
    })
    // listen only to expired events
    this.subClient.psubscribe('__keyevent@0__:expired')
  }

  public getAndDelAndEchoMessage(key) {
    this.client.multi()
      .get(key)
      .del(key)
      .exec((err, reply) => {
        console.log('Echo Message:', reply[0])
      })
  }

  public setMessage(input: {
    key: string,
    opaqueKey: string,
    val: string,
    expInSeconds: number
  }): boolean {
    this.client.multi()
      .set(input.key, input.val, 'EX', input.expInSeconds)
      .set(input.opaqueKey, input.val)
      .exec()

    return true
  }

}
