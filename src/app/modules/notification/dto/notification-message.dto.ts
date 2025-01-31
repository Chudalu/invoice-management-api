import { InvoiceStatus } from "../../invoice/enum/invoice-status.enum";

export class NotificationMessageDto {
    userId: number;
    invoiceStatus: InvoiceStatus;
    amount: number;
    title: string;
}