import { createHash, timingSafeEqual } from 'node:crypto';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RobloxTokenDto } from './roblox-token.dto.js';

const digest = (value: string) => createHash('sha256').update(value).digest();

@Injectable()
export class RobloxAuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  async issueToken(dto: RobloxTokenDto) {
    const expected = digest(this.config.getOrThrow<string>('ROBLOX_API_SECRET'));
    if (!timingSafeEqual(expected, digest(dto.secret))) {
      throw new UnauthorizedException();
    }

    const allowed = (this.config.get<string>('ALLOWED_PLACE_IDS') ?? '')
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean);
    if (allowed.length > 0 && !allowed.includes(String(dto.placeId))) {
      throw new ForbiddenException();
    }

    const expiresIn = Number(this.config.get('ROBLOX_JWT_TTL_SECONDS') ?? 600);
    const token = await this.jwt.signAsync(
      { sub: 'roblox', placeId: dto.placeId },
      { expiresIn },
    );
    return { token, expiresIn };
  }
}
