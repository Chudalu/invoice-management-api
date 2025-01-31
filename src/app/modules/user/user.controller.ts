import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { Roles } from 'src/app/repository/constants/roles-decorator.constants';
import { RoleEnum } from 'src/app/repository/enum/role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';

@ApiTags('User')
@Roles([RoleEnum.ADMIN])
@Controller('user')
export class UserController {

    constructor(private userService: UserService) {}

    @Post()
    async createUser(@Body() createUser: CreateUserDto): Promise<UserDto> {
        let user = await this.userService.create(createUser);
        return new UserDto(user);
    }

    @Get()
    async getUsers(): Promise<UserDto[]> {
        return await this.userService.findAll();
    }    

}
