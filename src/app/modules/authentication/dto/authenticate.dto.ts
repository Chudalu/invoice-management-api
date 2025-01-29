import { IsEmail, IsStrongPassword } from "class-validator";

export class AuthenticateDto {

    @IsEmail()
    email:string;

    @IsStrongPassword()
    password: string;
    
}