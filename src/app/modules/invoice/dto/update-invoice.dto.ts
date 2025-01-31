import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { InvoiceStatus } from "../enum/invoice-status.enum";

export class UpdateInvoiceDto {

    @IsString()
    @IsOptional()
    notes?: string;

    @IsString()
    @IsOptional()
    title?: string;

    @IsNumber()
    @IsOptional()
    amount?: number;

}
