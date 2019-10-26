import { ApiModelProperty } from '@nestjs/swagger'

export interface HealthcheckResponse {
  text: string,
  author: string
}

export interface ServerResponse<T> {
  err: number
  msg: string
  data?: T
}

export type EnvConfig = Record<string, string>

export class MessageDto {
  @ApiModelProperty()
  time: number
  @ApiModelProperty()
  message: string
}

export interface RedisConfig  {
  host: string
  port: number
}
