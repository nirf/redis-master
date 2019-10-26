import { Body, Controller, Post } from '@nestjs/common'
import { MessageDto } from '../common/common'
import { MessageService } from '../services/message/message.service'

@Controller('messages')
export class MessageController {

  constructor(private readonly messageService: MessageService) {
  }

  @Post('echoAtTime')
  echoAtTime(@Body() messageDto: MessageDto): MessageDto {
    return this.messageService.echoAtTime(messageDto)
  }
}
