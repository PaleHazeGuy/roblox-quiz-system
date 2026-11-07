import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DbModule } from './db/db.module.js';
import { PlayersModule } from './game/players/players.module.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DbModule, PlayersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
