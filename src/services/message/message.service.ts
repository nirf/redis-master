import { Injectable } from '@nestjs/common'
import { MessageDto } from '../../common/common'
import { RedisService } from '../redis/redis.service'

@Injectable()
export class MessageService {

  constructor(private readonly redisService: RedisService) {
  }

  echoAtTime(messageDto: MessageDto) {
    this.redisService.set(messageDto)
    return messageDto
  }
}
