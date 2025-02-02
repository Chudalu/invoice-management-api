import { IsNumberString, IsOptional, IsString } from "class-validator";

export class UpdateInvoiceDto {

    @IsString()
    @IsOptional()
    notes?: string;

    @IsString()
    @IsOptional()
    title?: string;

    @IsNumberString()
    @IsOptional()
    amount?: number;

}
