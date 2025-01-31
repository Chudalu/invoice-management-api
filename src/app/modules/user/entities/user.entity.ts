import { AutoIncrement, Column, CreatedAt, DataType, HasMany, HasOne, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
import { Notification } from "../../notification/entities/notification.entity";
import { InferAttributes, InferCreationAttributes } from "sequelize";
import { EntityStatus } from "src/app/repository/enum/entity-status.enum";
import { RoleEnum } from "src/app/repository/enum/role.enum";
import { Authentication } from "../../authentication/entities/authentication.entity";
import { Invoice } from "../../invoice/entities/invoice.entity";

@Table({
    freezeTableName: true,
})
export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id: number;

    @Column(DataType.STRING)
    userName: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true
    })
    email: string;

    @Column(DataType.STRING)
    passwordHash: string;

    @Column({
        type: DataType.STRING,
        defaultValue: RoleEnum.USER
    })
    role: RoleEnum;

    @Column({
        type: DataType.STRING,
        defaultValue: EntityStatus.INACTIVE
    })
    status: EntityStatus;

    @UpdatedAt
    @Column(DataType.DATE)
    updatedAt: Date;

    @CreatedAt
    @Column(DataType.DATE)
    createdAt: Date;

    @HasMany(() => Notification)
    notifications: Notification[];

    @HasOne(() => Authentication)
    authentication: Authentication;

    @HasMany(() => Invoice)
    invoices: Invoice[];
}
