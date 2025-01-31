import { EntityStatus } from "src/app/repository/enum/entity-status.enum";
import { InvoiceStatus } from "../enum/invoice-status.enum";
import { Invoice } from "../entities/invoice.entity";

export class InvoiceDto {
    title: string;
    notes?: string;
    amount: number;
    status: EntityStatus;
    invoiceStatus: InvoiceStatus;
    createdAt: Date;
    updatedAt: Date;

    constructor(invoice: Invoice) {
        this.title = invoice.title;
        this.amount = invoice.amount;
        this.status = invoice.status;
        this.createdAt = invoice.createdAt;
        this.updatedAt = invoice.updatedAt;
        this.invoiceStatus = invoice.invoiceStatus;
        if (invoice.notes) this.notes = invoice.notes;

    }
}