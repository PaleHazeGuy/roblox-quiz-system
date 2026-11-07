import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { RobloxAuthModule } from './auth/roblox/roblox-auth.module.js';
import { DbModule } from './db/db.module.js';
import { PlayersModule } from './game/players/players.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: Number(config.get('THROTTLE_TTL') ?? 60) * 1000,
            limit: Number(config.get('THROTTLE_LIMIT') ?? 100),
          },
        ],
      }),
    }),
    DbModule,
    RobloxAuthModule,
    PlayersModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
