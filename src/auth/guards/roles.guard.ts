import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) return true;

    const roleExpected = roles[0];
    const userRole: string =
      GqlExecutionContext.create(context).getContext().req.user.role['name'];

    if (!(userRole === roleExpected)) return false;

    return true;
  }
}
