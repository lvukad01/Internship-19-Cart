import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Role } from '@prisma/client';


@Injectable()
export class AdminGuard implements CanActivate{
    canActivate(context: ExecutionContext): boolean {
        const {user} = context.switchToHttp().getRequest();

        if(user && user.role=== Role.ADMIN){
            return true;
        }

        throw new ForbiddenException('Access denied: You need to be admin')
    }
}