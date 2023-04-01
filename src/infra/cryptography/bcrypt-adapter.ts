import { Encrypter } from '../../data/protocols/criptography/encrypter';
import { hash } from 'bcrypt';

export class BcryptAdapter implements Encrypter {
    private readonly salt: number;
    constructor(salt: number) {
        this.salt = salt;
    }

    async encrypt(value: string): Promise<string> {
        const response = await hash(value, this.salt);
        return response;
    }
}
