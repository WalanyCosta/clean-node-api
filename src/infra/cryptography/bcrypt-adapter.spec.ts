import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
    async hash(): Promise<string> {
        return await new Promise(resolve => resolve('hash'));
    },
}));

const makeSut = (salt = 15): BcryptAdapter => {
    const sut = new BcryptAdapter(salt);
    return sut;
};

describe('Bcrypt Adapter', () => {
    test('should call bcrypt with correct values', async () => {
        const salt = 12;
        const sut = makeSut(salt);
        const hashSpy = jest.spyOn(bcrypt, 'hash');
        await sut.encrypt('any_value');
        expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
    });

    test('should return a hash on success', async () => {
        const sut = makeSut();
        const hash = await sut.encrypt('any_value');
        expect(hash).toBe('hash');
    });
});
