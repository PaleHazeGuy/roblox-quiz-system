import { createHash, timingSafeEqual } from 'node:crypto';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

const digest = (value: string) => createHash('sha256').update(value).digest();

@Injectable()
export class RobloxAuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  async issueToken(secret: string | undefined, placeId: number) {
    const expected = digest(this.config.getOrThrow<string>('ROBLOX_API_SECRET'));
    if (!secret || !timingSafeEqual(expected, digest(secret))) {
      throw new UnauthorizedException();
    }

    const allowed = (this.config.get<string>('ALLOWED_PLACE_IDS') ?? '')
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean);
    if (allowed.length > 0 && !allowed.includes(String(placeId))) {
      throw new ForbiddenException();
    }

    const expiresIn = Number(this.config.get('ROBLOX_JWT_TTL_SECONDS') ?? 600);
    const token = await this.jwt.signAsync(
      { sub: 'roblox', placeId },
      { expiresIn },
    );
    return { token, expiresIn };
  }
}
