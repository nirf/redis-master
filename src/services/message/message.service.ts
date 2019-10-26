import { Injectable } from '@nestjs/common'
import { MessageDto } from '../../common/common'
import { RedisService } from '../redis/redis.service'
import * as utils from '../../utils/utils'

@Injectable()
export class MessageService {

  constructor(private readonly redisService: RedisService) {
  }

  public echoAtTime(messageDto: MessageDto): boolean {
    const diffInSeconds = utils.getDateDiffInSeconds(new Date().getTime(), messageDto.time)
    const key = utils.generateUniqueUUID()
    const opaqueKey = this.generateOpaqueKey(key)
    // TODO: do this 2 actions as atomic operation (i.e transaction)
    return this.redisService.set({
      key,
      val: messageDto.message,
      expInSeconds: diffInSeconds,
    }) && this.redisService.set({
      key: opaqueKey,
      val: messageDto.message,
    })
  }

  private generateOpaqueKey(key: string) {
    return `opaque:${key}`
  }

}
