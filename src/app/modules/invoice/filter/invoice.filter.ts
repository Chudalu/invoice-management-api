import { Op } from "sequelize";
import { InvoiceQueryDto } from "../dto/invoice-query.dto";
import { InvoiceStatus } from "../enum/invoice-status.enum";

export class InvoiceFilter {
    title?: Object;
    amount?: number;
    userId?: number;
    invoiceStatus?: InvoiceStatus

    constructor(query: InvoiceQueryDto) {
        if (query.amount) this.amount = query.amount;
        if (query.userId) this.userId = query.userId;
        if (query.invoiceStatus) this.invoiceStatus = query.invoiceStatus;
        if (query.title) this.title = { [Op.iLike]: `%${query.title}%` };
    }
}