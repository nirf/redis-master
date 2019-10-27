import { Injectable } from '@nestjs/common'
import { ConfigService } from '../../config/config.service'
import * as utils from '../../utils/utils'

const redis = require('redis')
const bluebird = require('bluebird')

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

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

    this.client.on('ready', async () => {
      console.log('Redis is ready')
      this.client.config('SET', 'notify-keyspace-events', 'Ex')
      await this.echoMessagesWhileServerWasDown()
    })

    this.subClient.on('pmessage', async (pattern, channel, message) => {
      const key = utils.generateOpaqueKey(message)
      await this.getAndDelAndEchoMessage(key)
    })
    // listen only to expired events
    this.subClient.psubscribe('__keyevent@0__:expired')
  }

  public async setMessage(input: {
    key: string,
    opaqueKey: string,
    val: string,
    expInSeconds: number
  }): Promise<boolean> {
    try {
      await this.client.multi()
        .set(input.key, input.val, 'EX', input.expInSeconds)
        .set(input.opaqueKey, input.val)
        .execAsync()

      return true
    } catch (e) {
      return false
    }
  }

  private async getAndDelAndEchoMessage(key) {
    const result = await this.client.multi()
      .get(key)
      .del(key)
      .execAsync()

    console.log('Echo Message:', result[0])
  }

  private async echoMessagesWhileServerWasDown() {
    const keys = await this.client.keysAsync('opaque:*')
    if (keys && keys.length) {
      const promises = []
      for (const key of keys) {
        const promise = this.getAndDelAndEchoMessage(key)
        promises.push(promise)
      }

      await Promise.all(promises)

    }

  }
}
