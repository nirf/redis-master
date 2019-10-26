import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from './config/config.module'
import { MessageController } from './controllers/message.controller'
import { MessageService } from './services/message/message.service'

@Module({
  imports: [ConfigModule],
  controllers: [AppController, MessageController],
  providers: [AppService, MessageService],
})
export class AppModule {
}
