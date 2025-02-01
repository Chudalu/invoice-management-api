import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AuthenticationService } from 'src/app/modules/authentication/authentication.service';
import { CreateUserDto } from 'src/app/modules/user/dto/create-user.dto';
import { UserService } from 'src/app/modules/user/user.service';
import { RoleEnum } from 'src/app/repository/enum/role.enum';

@Injectable()
export class CronService {

    private users: CreateUserDto[] = [
        {
            userName: 'company1',
            email: 'company1@email.com',
            password: 'Password123@'
        },
        {
            userName: 'company2',
            email: 'company2@email.com',
            password: 'Password123&'
        }
    ];
    private admins: CreateUserDto[] = [
        {
            userName: 'admin1',
            email: 'admin1@email.com',
            password: 'Password123@',
            role: RoleEnum.ADMIN
        },
        {
            userName: 'admin2',
            email: 'admin2@email.com',
            password: 'Password123&',
            role: RoleEnum.ADMIN
        }
    ];

    
    constructor(
        private userService: UserService,
        private authService: AuthenticationService
    ) {}

    @Cron(CronExpression.EVERY_10_SECONDS)
    async createUsers() {
        let existingUsers = await this.userService.findAll();
        this.users.forEach(async (user) => {
            if (!existingUsers.find(u => u.email === user.email)) {
                await this.authService.register(user);
            }
        });
    }

    @Cron(CronExpression.EVERY_10_SECONDS)
    async createAdminUsers() {
        let existingAdmins = await this.userService.findAll();
        this.admins.forEach(async (admin) => {
            if (!existingAdmins.find(a => a.email === admin.email)) {
                await this.authService.register(admin);
            }
        });
    }
}
