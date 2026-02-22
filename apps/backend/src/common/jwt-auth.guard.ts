import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import jwt from 'jsonwebtoken';
@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const auth = req.headers.authorization;
    if (!auth) throw new UnauthorizedException('Missing bearer token');
    const token = auth.replace('Bearer ', '');
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET || 'dev_jwt_secret');
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
