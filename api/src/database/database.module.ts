import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.getOrThrow('DATASOURCE_HOST'),
        port: configService.getOrThrow('DATASOURCE_PORT'),
        username: configService.getOrThrow('DATASOURCE_USERNAME'),
        password: configService.getOrThrow('DATASOURCE_PASSWORD'),
        database: configService.getOrThrow('DATASOURCE_DATABASE'),
        synchronize: configService.getOrThrow('MYSQL_SYNCHRONIZE'),
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
