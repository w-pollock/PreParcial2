import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AdminTokenGuard implements CanActivate {
  private static readonly HEADER_NAME = 'x-admin-token';
  private static readonly EXPECTED_TOKEN = 'TRAVEL_PLANNER_SECRETO';

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers[AdminTokenGuard.HEADER_NAME] as
      | string
      | undefined;

    if (!token || token !== AdminTokenGuard.EXPECTED_TOKEN) {
      throw new ForbiddenException('no hay admin token o es inválida');
    }

    return true;
  }
}
