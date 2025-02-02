import { AutoIncrement, Column, CreatedAt, DataType, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
import { User } from "../../user/entities/user.entity";
import { InferAttributes, InferCreationAttributes } from "sequelize";
import { EntityStatus } from "src/app/repository/enum/entity-status.enum";

@Table({
    freezeTableName: true,
})
export class Notification extends Model<InferAttributes<Notification>, InferCreationAttributes<Notification>> {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id: number;

    @Column(DataType.TEXT)
    message: string;

    @Column({
        type: DataType.STRING,
        defaultValue: EntityStatus.ACTIVE
    })
    status: EntityStatus;

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
