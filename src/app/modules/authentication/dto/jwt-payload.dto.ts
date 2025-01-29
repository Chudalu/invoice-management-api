export class JwtPayloadDto {
    sub: number;
    account: string;

    constructor(userId: number, encryptedAccount: string) {
        this.sub = userId;
        this.account = encryptedAccount;
    }
}