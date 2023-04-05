import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
    async hash(): Promise<string> {
        return new Promise(resolve => resolve('hash'));
    },

    async compare(): Promise<boolean> {
        return new Promise(resolve => resolve(true));
    },
}));

const makeSut = (salt = 15): BcryptAdapter => {
    const sut = new BcryptAdapter(salt);
    return sut;
};

describe('Bcrypt Adapter', () => {
    test('should call hash with correct values', async () => {
        const salt = 12;
        const sut = makeSut(salt);
        const hashSpy = jest.spyOn(bcrypt, 'hash');
        await sut.hash('any_value');
        expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
    });

    test('should return a valid hash on hash success', async () => {
        const sut = makeSut();
        const hash = await sut.hash('any_value');
        expect(hash).toBe('hash');
    });

    test('should throw if hash throws', async () => {
        const sut = makeSut();
        const mockedHash = bcrypt.hash as jest.Mock<any, any>;
        mockedHash.mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error())),
        );
        const promise = sut.hash('any_value');
        await expect(promise).rejects.toThrow();
    });

    test('should call compare with correct values', async () => {
        const salt = 12;
        const sut = makeSut(salt);
        const hashSpy = jest.spyOn(bcrypt, 'compare');
        await sut.compare('any_value', 'any_hash');
        expect(hashSpy).toHaveBeenCalledWith('any_value', 'any_hash');
    });

    test('should return a true on compare success', async () => {
        const sut = makeSut();
        const hash = await sut.compare('any_value', 'any_hash');
        expect(hash).toBeTruthy();
    });

    test('should throw if compare throws', async () => {
        const sut = makeSut();
        const mockedCompare = bcrypt.compare as jest.Mock<any, any>;
        mockedCompare.mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error())),
        );
        const promise = sut.compare('any_value', 'hash_value');
        await expect(promise).rejects.toThrow();
    });
});
