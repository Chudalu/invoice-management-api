export class AuthenticationResponseDto {
    jwtToken: string;

    constructor(jwtToken: string) {
        this.jwtToken = jwtToken
    }
}