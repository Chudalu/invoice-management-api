import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class RepositoryService {
    constructor(private sequelize: Sequelize) {
        sequelize.sync({ alter: true });
    }
}
