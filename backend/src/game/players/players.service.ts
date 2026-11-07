import { Inject, Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { DB } from '../../db/db.constants.js';
import type { Db } from '../../db/db.module.js';
import { players } from '../../db/schema.js';
import { JoinPlayerDto } from './join-player.dto.js';

@Injectable()
export class PlayersService {
  constructor(@Inject(DB) private readonly db: Db) {}

  async recordJoin(dto: JoinPlayerDto) {
    const values = {
      robloxUserId: String(dto.userId),
      username: dto.username,
      displayName: dto.displayName ?? null,
      accountAgeDays: dto.accountAgeDays ?? null,
      region: dto.region ?? null,
      policyFlags: dto.policyFlags ?? null,
    };

    const [row] = await this.db
      .insert(players)
      .values(values)
      .onConflictDoUpdate({
        target: players.robloxUserId,
        set: {
          username: values.username,
          displayName: sql`coalesce(excluded.display_name, players.display_name)`,
          accountAgeDays: sql`coalesce(excluded.account_age_days, players.account_age_days)`,
          region: sql`coalesce(excluded.region, players.region)`,
          policyFlags: sql`coalesce(excluded.policy_flags, players.policy_flags)`,
          lastSeen: sql`now()`,
        },
      })
      .returning({
        id: players.id,
        isNew: sql<boolean>`(xmax = 0)`,
      });

    return { id: row.id, isNew: row.isNew };
  }
}
