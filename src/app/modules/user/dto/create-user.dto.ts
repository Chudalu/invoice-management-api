import { IsEmail, IsEnum, IsLowercase, IsOptional, IsString, IsStrongPassword } from "class-validator";
import { EntityStatus } from "src/app/repository/enum/entity-status.enum";
import { RoleEnum } from "src/app/repository/enum/role.enum";

export class CreateUserDto {

    @IsString()
    userName: string;

    @IsLowercase()
    @IsEmail()
    email: string;

    @IsStrongPassword({ minLength: 8 })
    password?: string;

    @IsOptional()
    @IsEnum(RoleEnum)
    role?: RoleEnum;

    @IsOptional()
    @IsString()
    status?: EntityStatus;
    
}
