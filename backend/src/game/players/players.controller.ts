import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RobloxAuthGuard } from '../../common/guards/roblox-auth.guard.js';
import { JoinPlayerDto } from './join-player.dto.js';
import { PlayersService } from './players.service.js';

@Controller('game/players')
@UseGuards(RobloxAuthGuard)
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post('join')
  join(@Body() dto: JoinPlayerDto) {
    return this.playersService.recordJoin(dto);
  }
}
