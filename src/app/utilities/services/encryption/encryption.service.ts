import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENCRYPTION_KEY } from 'src/app/repository/constants/env-variables.constants';

@Injectable()
export class EncryptionService {

    private encryptionKey: string;
    constructor(private readonly configService: ConfigService) {
        this.encryptionKey = configService.get<string>(ENCRYPTION_KEY);
    }

    encrypt(textToEncrypt: string, optionalKey?: string): string {
        let textToChars = (text: any) => text.split('').map((c: any) => c.charCodeAt(0));
        let byteHex = (n: any) => ('0' + Number(n).toString(16)).substr(-2);
        let applySaltToChar = (code: any) => textToChars(optionalKey ? optionalKey : this.encryptionKey).reduce((a: any, b: any) => a ^ b, code);
        return textToEncrypt.split('').map(textToChars).map(applySaltToChar).map(byteHex).join('');
    }

    decrypt(textToDecrypt: string, optionalKey?: string): string {
        let textToChars = (text: any) => text.split('').map((c: any) => c.charCodeAt(0));
        let applySaltToChar = (code: any) => textToChars(optionalKey ? optionalKey : this.encryptionKey).reduce((a: any, b: any) => a ^ b, code);
        return textToDecrypt.match(/.{1,2}/g).map((hex: any) => parseInt(hex, 16)).map(applySaltToChar)
        .map((charCode: any) => String.fromCharCode(charCode))
        .join('');
    }
}
