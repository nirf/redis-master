import { Body, Controller, Post } from '@nestjs/common'
import { MessageDto, ServerResponse } from '../common/common'
import { MessageService } from '../services/message/message.service'
import * as utils from '../utils/utils'

@Controller('messages')
export class MessageController {

  constructor(private readonly messageService: MessageService) {
  }

  @Post('echoAtTime')
  async echoAtTime(@Body() messageDto: MessageDto): Promise<ServerResponse<boolean>> {
    try {
      const inputValidationResult = this.validateInput(messageDto)
      if (!inputValidationResult.valid) {
        return {
          err: 1,
          msg: inputValidationResult.msg,
        }
      }
      const res = await this.messageService.echoAtTime(messageDto)
      if (!res) {
        return {
          err: 1,
          msg: 'Something went wrong, please try again',
        }
      }

      return {
        err: 0,
        msg: 'Wrote message successfully',
        data: res,
      }

    } catch (e) {
      console.error(e.message, e.stack)
      return {
        err: 1,
        msg: 'Something went wrong, please try again',
      }
    }
  }

  private validateInput(messageDto: MessageDto): {
    valid: boolean,
    msg?: string
  } {
    if (!messageDto) {
      return {
        valid: false,
        msg: 'Message is a required input. please supply message, time',
      }
    }
    if (!messageDto.message || messageDto.message.length < 1) {
      return {
        valid: false,
        msg: 'message is required',
      }
    }
    if (!messageDto.time || messageDto.time < 0) {
      return {
        valid: false,
        msg: 'time is required',
      }
    }
    const diffInSeconds = utils.getDateDiffInSeconds(new Date().getTime(), messageDto.time)
    if (diffInSeconds <= 0) {
      return {
        valid: false,
        msg: 'please supply a valid time in the future',
      }
    }

    return {
      valid: true,
    }
  }
}
