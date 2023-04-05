import { Hasher } from '../../data/protocols/criptography/hasher';
import { hash } from 'bcrypt';

export class BcryptAdapter implements Hasher {
    private readonly salt: number;
    constructor(salt: number) {
        this.salt = salt;
    }

    async hash(value: string): Promise<string> {
        const response = await hash(value, this.salt);
        return response;
    }
}
