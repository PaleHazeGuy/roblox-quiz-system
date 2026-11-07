import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RobloxAuthController } from './roblox-auth.controller.js';
import { RobloxAuthService } from './roblox-auth.service.js';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('ROBLOX_JWT_SECRET'),
      }),
    }),
  ],
  controllers: [RobloxAuthController],
  providers: [RobloxAuthService],
  exports: [JwtModule],
})
export class RobloxAuthModule {}
