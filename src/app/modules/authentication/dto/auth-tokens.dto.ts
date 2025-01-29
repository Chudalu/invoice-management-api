export class AuthTokensDto {
    jwtToken: string;
    authenticationToken: string;

    constructor(jwtToken: string, authenticationToken: string) {
        this.jwtToken = jwtToken;
        this.authenticationToken = authenticationToken;
    }
}