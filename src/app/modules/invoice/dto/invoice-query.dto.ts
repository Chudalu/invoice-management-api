import { IsEnum, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";
import { InvoiceStatus } from "../enum/invoice-status.enum";

export class InvoiceQueryDto {

    @IsString()
    @IsOptional()
    title?: string;

    @IsNumberString()
    @IsOptional()
    amount?: number;

    @IsNumberString()
    @IsOptional()
    userId?: number;

    @IsEnum(InvoiceStatus)
    @IsOptional()
    invoiceStatus?: InvoiceStatus;

    @IsNumberString()
    @IsOptional()
    offset?: number;

    @IsNumberString()
    @IsOptional()
    limit?: number;

}