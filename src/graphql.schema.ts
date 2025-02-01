
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface InvoiceReportDto {
    totalInvoices?: Nullable<number>;
    paidInvoices?: Nullable<number>;
    unpaidInvoices?: Nullable<number>;
    declinedInvoices?: Nullable<number>;
}

export interface UserReportDto {
    totalUsers?: Nullable<number>;
    clients?: Nullable<number>;
    admins?: Nullable<number>;
}

export interface IQuery {
    getInvoiceReport(): Nullable<InvoiceReportDto> | Promise<Nullable<InvoiceReportDto>>;
    getUserReport(): Nullable<UserReportDto> | Promise<Nullable<UserReportDto>>;
}

type Nullable<T> = T | null;
