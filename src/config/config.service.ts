import * as dotenv from 'dotenv'
import * as Joi from '@hapi/joi'
import * as fs from 'fs'
import { EnvConfig, RedisConfig } from '../common/common'

export class ConfigService {
  private readonly envConfig: EnvConfig

  constructor(filePath: string) {
    const config = dotenv.parse(fs.readFileSync(filePath))
    this.envConfig = this.validateInput(config)
  }

  get swaggerSchema(): 'http' | 'https' {
    return this.convertSwaggerSchemaStringToType(this.get('SWAGGER_SCHEMA'))
  }

  get port(): number {
    return Number(this.get('PORT'))
  }

  get nodeEnv(): string {
    return this.get('NODE_ENV')
  }

  get redisConfig(): RedisConfig {
    return {
      host: this.get('REDIS_HOST'),
      port: Number(this.get('REDIS_PORT')),
    }
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   */
  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid('development', 'docker')
        .default('development'),
      PORT: Joi.number()
        .default(3000),
      SWAGGER_SCHEMA: Joi.string()
        .valid('http', 'https')
        .required(),
      REDIS_HOST: Joi.string()
        .required(),
      REDIS_PORT: Joi.number()
        .required(),
    })

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig,
    )
    if (error) {
      throw new Error(`Config validation error: ${error.message}`)
    }
    return validatedEnvConfig
  }

  private get(key: string): string {
    return this.envConfig[key]
  }

  private convertSwaggerSchemaStringToType(schema: string): 'http' | 'https' {
    switch (schema) {
      case 'http':
        return 'http'
      case 'https':
        return 'https'
    }
  }
}
