export class RefreshTokenDto {
    userId: number;
    password: string;
    ip: string;
    revoked?: boolean;

    constructor(id: number, password: string, ipAddress: string) {
        this.userId = Number(id);
        this.password = password;
        this.ip = ipAddress;
    }
}