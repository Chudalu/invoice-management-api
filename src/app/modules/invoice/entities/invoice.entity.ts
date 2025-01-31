import { AutoIncrement, Column, CreatedAt, DataType, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
import { InferAttributes, InferCreationAttributes } from "sequelize";
import { EntityStatus } from "src/app/repository/enum/entity-status.enum";
import { InvoiceStatus } from "../enum/invoice-status.enum";
import { User } from "../../user/entities/user.entity";

@Table({
    freezeTableName: true,
})
export class Invoice extends Model<InferAttributes<Invoice>, InferCreationAttributes<Invoice>> {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    title: string;

    @Column(DataType.TEXT)
    notes: string;

    @Column(DataType.DOUBLE)
    amount: number;

    @Column({
        type: DataType.STRING,
        defaultValue: EntityStatus.ACTIVE
    })
    status: EntityStatus;

    @Column({
        type: DataType.STRING,
        defaultValue: InvoiceStatus.UNPAID
    })
    invoiceStatus: InvoiceStatus;

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
