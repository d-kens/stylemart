import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { RoleEnum } from "src/enums/role.enum";
import { ROLES_KEY } from "../decorators/roles.decorator";


@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        /**
         * Extract the required roles that we have set inside the roles decorator from the specific 
         * route using the roles guard
         */
        const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        /**
         * Check the roles of the user
         */
        const user = context.switchToHttp().getRequest().user;
        const hasRequiredRoles = requiredRoles.some(role => user.role === role)
        
        return hasRequiredRoles
    }

}