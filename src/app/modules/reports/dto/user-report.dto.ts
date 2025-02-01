import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UserReportDto {
    @Field(() => Int)
    totalUsers: number;

    @Field(() => Int)
    clients: number;

    @Field(() => Int)
    admins: number;
}