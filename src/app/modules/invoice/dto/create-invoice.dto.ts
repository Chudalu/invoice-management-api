import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateInvoiceDto {

    @IsString()
    title: string;

    @IsString()
    @IsOptional()
    notes: string;

    @IsNumber()
    amount: number;
    
}
