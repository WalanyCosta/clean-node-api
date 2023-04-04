import { AuthenticationModel } from '../../../domain/usecases/authentication';
import { HashComparer } from '../../protocols/criptography/hash-comparer';
import { TokenGenerator } from '../../protocols/criptography/token-generator';
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';
import { UpdateAccessTokenGenerator } from '../../protocols/db/update-access-token-generator';
import { AccountModel } from '../add-account/db-add-account-protocols';
import { DbAuthentication } from './db-authentication';

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub
        implements LoadAccountByEmailRepository
    {
        async load(email: string): Promise<AccountModel> {
            return new Promise(resolve => resolve(makeFakeAccount()));
        }
    }
    return new LoadAccountByEmailRepositoryStub();
};

const makeHashCompare = (): HashComparer => {
    class HashComparerStub implements HashComparer {
        async compare(value: string, hash: string): Promise<boolean> {
            return new Promise(resolve => resolve(true));
        }
    }
    return new HashComparerStub();
};

const makeTokenGenerator = (): TokenGenerator => {
    class TokenGeneratorStub implements TokenGenerator {
        async generate(id: string): Promise<string> {
            return new Promise(resolve => resolve('any_token'));
        }
    }
    return new TokenGeneratorStub();
};

const makeUpdateAccessTokenGenerator = (): UpdateAccessTokenGenerator => {
    class UpdateAccessTokenGeneratorStub implements UpdateAccessTokenGenerator {
        async update(id: string, token: string): Promise<void> {
            return new Promise(resolve => resolve());
        }
    }
    return new UpdateAccessTokenGeneratorStub();
};

const makeFakeAuthentication = (): AuthenticationModel => ({
    email: 'any_email@mail.com',
    password: 'any_password',
});

const makeFakeAccount = (): AccountModel => ({
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'hashed_password',
});

interface SutTypes {
    sut: DbAuthentication;
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
    hashComparerStub: HashComparer;
    tokenGeneratorStub: TokenGenerator;
    updateAccessTokenGeneratorStub: UpdateAccessTokenGenerator;
}

const makeSut = (): SutTypes => {
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
    const hashComparerStub = makeHashCompare();
    const tokenGeneratorStub = makeTokenGenerator();
    const updateAccessTokenGeneratorStub = makeUpdateAccessTokenGenerator();
    const sut = new DbAuthentication(
        loadAccountByEmailRepositoryStub,
        hashComparerStub,
        tokenGeneratorStub,
        updateAccessTokenGeneratorStub,
    );

    return {
        sut,
        loadAccountByEmailRepositoryStub,
        hashComparerStub,
        tokenGeneratorStub,
        updateAccessTokenGeneratorStub,
    };
};

describe('DbAuthentication UseCase', () => {
    test('should call LoadAccountByEmailRepository with correct email', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut();
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load');
        await sut.auth(makeFakeAuthentication());
        expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
    });

    test('should throw if LoadAccountByEmailRepository throws', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut();
        jest.spyOn(
            loadAccountByEmailRepositoryStub,
            'load',
        ).mockRejectedValueOnce(new Error());
        const promise = sut.auth(makeFakeAuthentication());
        expect(promise).rejects.toThrow();
    });

    test('should return null if LoadAccountByEmailRepository returns null', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut();
        jest.spyOn(
            loadAccountByEmailRepositoryStub,
            'load',
        ).mockReturnValueOnce(null);
        const accessToken = await sut.auth(makeFakeAuthentication());
        expect(accessToken).toBeNull();
    });

    test('should call HashComparer with correct email', async () => {
        const { sut, hashComparerStub } = makeSut();
        const compareSpy = jest.spyOn(hashComparerStub, 'compare');
        await sut.auth(makeFakeAuthentication());
        expect(compareSpy).toHaveBeenCalledWith(
            'any_password',
            'hashed_password',
        );
    });

    test('should throw if HashComparer throws', async () => {
        const { sut, hashComparerStub } = makeSut();
        jest.spyOn(hashComparerStub, 'compare').mockRejectedValueOnce(
            new Error(),
        );
        const promise = sut.auth(makeFakeAuthentication());
        expect(promise).rejects.toThrow();
    });

    test('should return null if HashComparer returns false', async () => {
        const { sut, hashComparerStub } = makeSut();
        jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(
            Promise.resolve(false),
        );
        const accessToken = await sut.auth(makeFakeAuthentication());
        expect(accessToken).toBeNull();
    });

    test('should call TokenGenerator with correct id', async () => {
        const { sut, tokenGeneratorStub } = makeSut();
        const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate');
        await sut.auth(makeFakeAuthentication());
        expect(generateSpy).toHaveBeenCalledWith('any_id');
    });

    test('should throw if TokenGenerator throws', async () => {
        const { sut, tokenGeneratorStub } = makeSut();
        jest.spyOn(tokenGeneratorStub, 'generate').mockRejectedValueOnce(
            new Error(),
        );
        const promise = sut.auth(makeFakeAuthentication());
        expect(promise).rejects.toThrow();
    });

    test('should call TokenGenerator with correct id', async () => {
        const { sut } = makeSut();
        const accessToken = await sut.auth(makeFakeAuthentication());
        expect(accessToken).toBe('any_token');
    });

    test('should call UpdateAccessTokenGenerator with correct values', async () => {
        const { sut, updateAccessTokenGeneratorStub } = makeSut();
        const updateSpy = jest.spyOn(updateAccessTokenGeneratorStub, 'update');
        await sut.auth(makeFakeAuthentication());
        expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token');
    });

    test('should throw if UpdateAccessTokenGenerator throws', async () => {
        const { sut, updateAccessTokenGeneratorStub } = makeSut();
        jest.spyOn(
            updateAccessTokenGeneratorStub,
            'update',
        ).mockRejectedValueOnce(new Error());
        const promise = sut.auth(makeFakeAuthentication());
        expect(promise).rejects.toThrow();
    });
});
