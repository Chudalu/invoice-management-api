import { EntityStatus } from "src/app/repository/enum/entity-status.enum";
import { User } from "../../user/entities/user.entity";
import { RoleEnum } from "src/app/repository/enum/role.enum";

export class UserDto {
    id: number;
    userName: string;
    email: string;
    role: RoleEnum;
    status: EntityStatus;
    createdAt: Date;

    constructor(user: User) {
        this.id = Number(user.id);
        this.userName = user.userName;
        this.email = user.email;
        this.role = user.role;
        this.status = user.status;
        this.createdAt = user.createdAt;
    }
}