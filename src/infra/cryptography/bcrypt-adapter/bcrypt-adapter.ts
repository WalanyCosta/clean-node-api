import { Hasher } from '../../../data/protocols/criptography/hasher';
import { HashComparer } from '../../../data/protocols/criptography/hash-comparer';
import { hash, compare } from 'bcrypt';

export class BcryptAdapter implements Hasher, HashComparer {
    constructor(private readonly salt: number) {}

    async hash(value: string): Promise<string> {
        const response = await hash(value, this.salt);
        return response;
    }

    async compare(value: string, hash: string): Promise<boolean> {
        const response = await compare(value, hash);
        return response;
    }
}
