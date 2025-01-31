import { IsEnum, IsNumber, IsOptional } from "class-validator";
import { InvoiceStatus } from "../enum/invoice-status.enum";

export class UpdateInvoiceStatusDto {

    @IsNumber()
    id: number;

    @IsEnum(InvoiceStatus)
    invoiceStatus: InvoiceStatus;

}