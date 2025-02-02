import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { EntityStatus } from 'src/app/repository/enum/entity-status.enum';
import { BcryptService } from 'src/app/utilities/services/bcrypt/bcrypt.service';
import { User } from './entities/user.entity';
import { UserDto } from './dto/user.dto';
import { OrderDirectionEnum } from 'src/app/repository/enum/order-direction.enum';

@Injectable()
export class UserService {
  
  constructor(
    @InjectModel(User)
    private UserRepository: typeof User,
    private bcryptService: BcryptService,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    let user = await this.UserRepository.findOne({ where: { email: createUserDto.email, status: { [Op.ne]: EntityStatus.DELETED } } });
    if (user) {
      throw new ConflictException('Email already linked to another account');
    }
    return await this.UserRepository.create({
      ...createUserDto,
      passwordHash: await this.bcryptService.hash(createUserDto.password)
    });
  }

  async findOneById(id: number): Promise<User> {
    return await this.UserRepository.findOne({ where: { id, status: EntityStatus.ACTIVE } });
  }

  async findNotDeletedUserByEmail(email: string): Promise<User> {
    return await this.UserRepository.findOne({ where: { email, status: { [Op.ne]: EntityStatus.DELETED } } });
  }

  async findAll() {
    let users = await this.UserRepository.findAll({ order: [['createdAt', OrderDirectionEnum.ASC]] });
    return users.map(u => new UserDto(u));
  }
}
