import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class InvoiceReportDto {
    @Field(() => Int)
    totalInvoices: number;

    @Field(() => Int)
    paidInvoices: number;

    @Field(() => Int)
    unpaidInvoices: number;

    @Field(() => Int)
    declinedInvoices: number;
}