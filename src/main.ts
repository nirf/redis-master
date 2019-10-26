import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { constants } from './utils/project.constants'
import { ConfigService } from './config/config.service'
import { ConfigModule } from './config/config.module'

async function bootstrap() {
  // TODO: add detailed readme file that explaines the program
  // and add docker and docker-compose file to easily run the program
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix(constants.globalPrefix)

  const configService: ConfigService = app.select(ConfigModule).get(ConfigService, { strict: true })

  const options = new DocumentBuilder()
    .setTitle(constants.service)
    .setDescription(constants.description)
    .setBasePath(constants.globalPrefix)
    .setSchemes(configService.swaggerSchema)
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup(`${constants.globalPrefix}/swagger`, app, document)

  await app.listen(configService.port)

  return configService
}

bootstrap()
  .then((configService) => {
    console.log(`Project started successfully using '${configService.nodeEnv}' environment`)
    console.log(`Open your browser and navigate to http://localhost:3000/${constants.globalPrefix}/swagger`)
  })
  .catch(err => {
    const errorMessage = `Failed to start: ${err.message}`
    console.error(errorMessage)
    throw new Error(errorMessage)
  })
