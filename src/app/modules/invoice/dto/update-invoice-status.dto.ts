import { IsEnum, IsNumber, IsNumberString } from "class-validator";
import { InvoiceStatus } from "../enum/invoice-status.enum";

export class UpdateInvoiceStatusDto {

    @IsEnum(InvoiceStatus)
    invoiceStatus: InvoiceStatus;

}