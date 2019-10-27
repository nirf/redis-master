import { Injectable } from '@nestjs/common'
import { MessageDto } from '../../common/common'
import { RedisService } from '../redis/redis.service'
import * as utils from '../../utils/utils'

@Injectable()
export class MessageService {

  constructor(private readonly redisService: RedisService) {
  }

  public async echoAtTime(messageDto: MessageDto): Promise<boolean> {
    const diffInSeconds = utils.getDateDiffInSeconds(new Date().getTime(), messageDto.time)
    const key = utils.generateUniqueUUID()
    const opaqueKey = utils.generateOpaqueKey(key)

    return await this.redisService.setMessage({
      key,
      opaqueKey,
      val: messageDto.message,
      expInSeconds: diffInSeconds,
    })
  }
}
