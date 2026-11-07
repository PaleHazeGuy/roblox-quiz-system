import { Body, Controller, Post } from '@nestjs/common';
import { JoinPlayerDto } from './join-player.dto.js';
import { PlayersService } from './players.service.js';

@Controller('game/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post('join')
  join(@Body() dto: JoinPlayerDto) {
    return this.playersService.recordJoin(dto);
  }
}
