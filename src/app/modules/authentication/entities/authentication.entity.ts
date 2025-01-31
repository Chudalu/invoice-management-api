import { Model, PrimaryKey, Column, DataType, UpdatedAt, CreatedAt, Table, ForeignKey, AutoIncrement } from "sequelize-typescript";
import { User } from "../../user/entities/user.entity";
import { InferAttributes, InferCreationAttributes } from "sequelize";
import { EntityStatus } from "src/app/repository/enum/entity-status.enum";

@Table({
    freezeTableName: true,
})
export class Authentication extends Model<InferAttributes<Authentication>, InferCreationAttributes<Authentication>> {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id: number;

    @Column(DataType.STRING)
    ascii: string;

    @Column(DataType.STRING)
    hex: string;

    @Column(DataType.STRING)
    base32: string;

    @Column(DataType.STRING)
    url: string;

    @Column({
        type: DataType.STRING,
        defaultValue: EntityStatus.ACTIVE
    })
    status: string;

    @UpdatedAt
    @Column(DataType.DATE)
    updatedAt: Date;

    @CreatedAt
    @Column(DataType.DATE)
    createdAt: Date;

    @ForeignKey(() => User)
    @Column(DataType.BIGINT)
    userId: number;
}