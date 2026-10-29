import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        console.log('DB connection check:', {
          host: config.getOrThrow<string>('database.host'),
          username: config.getOrThrow<string>('database.username'),
          database: config.getOrThrow<string>('database.name'),
        });
        return {
          type: 'postgres',
          host: config.getOrThrow<string>('database.host'),
          port: config.getOrThrow<number>('database.port'),
          username: config.getOrThrow<string>('database.username'),
          password: config.getOrThrow<string>('database.password'),
          database: config.getOrThrow<string>('database.name'),
          autoLoadEntities: true,
          namingStrategy: new SnakeNamingStrategy(),
          synchronize: false,
          logging: config.getOrThrow<boolean>('database.logging'),
        };
      },
    }),
  ],
})
export class DatabaseModule {}
