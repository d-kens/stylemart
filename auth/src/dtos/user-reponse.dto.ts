import { User } from "src/entities/user.entity";
import { RoleEnum } from "src/enums/role.enum";

export class UserReponseDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: RoleEnum;
    createdAt: Date;
    updatedAt: Date;


    constructor(user: User) {
        this.id = user.id;
        this.firstName = user.firstName
        this.lastName = user.lastName
        this.email = user.email;
        this.role = user.role
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }
}