import { Injectable } from '@nestjs/common'
import { MessageDto } from '../../common/common'

@Injectable()
export class MessageService {

  echoAtTime(messageDto: MessageDto) {
    return messageDto
  }
}
