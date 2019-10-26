import { Body, Controller, Post } from '@nestjs/common'
import { MessageDto, ServerResponse } from '../common/common'
import { MessageService } from '../services/message/message.service'

@Controller('messages')
export class MessageController {

  constructor(private readonly messageService: MessageService) {
  }

  @Post('echoAtTime')
  echoAtTime(@Body() messageDto: MessageDto): ServerResponse<MessageDto> {
    try {
      // TODO: validate input and decide on time format
      return {
        err: 0,
        msg: 'Wrote message successfully',
        data: this.messageService.echoAtTime(messageDto),
      }

    } catch (e) {

      return {
        err: 1,
        msg: 'Something went wrong, please try again',
      }
    }
  }
}
