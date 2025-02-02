import { IsNumberString, IsOptional, IsString } from "class-validator";

export class CreateInvoiceDto {

    @IsString()
    title: string;

    @IsString()
    @IsOptional()
    notes: string;

    @IsNumberString()
    amount: number;
    
}
