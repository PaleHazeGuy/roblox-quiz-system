import { Module } from '@nestjs/common';
import { RobloxAuthModule } from '../../auth/roblox/roblox-auth.module.js';
import { PlayersController } from './players.controller.js';
import { PlayersService } from './players.service.js';

@Module({
  imports: [RobloxAuthModule],
  controllers: [PlayersController],
  providers: [PlayersService],
})
export class PlayersModule {}
