import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { RobloxAuthService } from './roblox-auth.service.js';
import { RobloxTokenDto } from './roblox-token.dto.js';

@Controller('auth/roblox')
export class RobloxAuthController {
  constructor(private readonly auth: RobloxAuthService) {}

  @Post('token')
  @HttpCode(200)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  token(@Body() dto: RobloxTokenDto) {
    return this.auth.issueToken(dto);
  }
}
