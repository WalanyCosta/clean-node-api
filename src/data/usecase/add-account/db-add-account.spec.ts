import { AddAccountRepository } from '../../protocols/db/account/add-account-repository';
import {
    AddAccountModel,
    Hasher,
    DbAddAccount,
    AccountModel,
    LoadAccountByEmailRepository,
} from './db-add-account-protocols';

const makeHasher = (): Hasher => {
    class HasherStub implements Hasher {
        async hash(value: string): Promise<string> {
            return await Promise.resolve('hashed_password');
        }
    }
    return new HasherStub();
};

const makeAddAccountRepository = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        async add(accountData: AddAccountModel): Promise<AccountModel> {
            return await new Promise(resolve => resolve(makeFakeAccount()));
        }
    }
    return new AddAccountRepositoryStub();
};

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub
        implements LoadAccountByEmailRepository
    {
        async loadByEmail(email: string): Promise<AccountModel> {
            return new Promise(resolve => resolve(makeFakeAccount()));
        }
    }
    return new LoadAccountByEmailRepositoryStub();
};

const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'hashed_password',
});

const makeFakeAccountData = (): AddAccountModel => ({
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password',
});

type SutTypes = {
    sut: DbAddAccount;
    HasherStub: Hasher;
    addAccountRepositoryStub: AddAccountRepository;
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
};

const makeSut = (): SutTypes => {
    const HasherStub = makeHasher();
    const addAccountRepositoryStub = makeAddAccountRepository();
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
    const sut = new DbAddAccount(
        HasherStub,
        addAccountRepositoryStub,
        loadAccountByEmailRepositoryStub,
    );
    return {
        sut,
        HasherStub,
        addAccountRepositoryStub,
        loadAccountByEmailRepositoryStub,
    };
};

describe('DbAddAccount Usecases', () => {
    test('should call hash with correct password', async () => {
        const { sut, HasherStub } = makeSut();
        const hashSpy = jest.spyOn(HasherStub, 'hash');
        await sut.add(makeFakeAccountData());
        expect(hashSpy).toHaveBeenCalledWith('valid_password');
    });

    test('should throw if hash throws', async () => {
        const { sut, HasherStub } = makeSut();
        jest.spyOn(HasherStub, 'hash').mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error())),
        );
        const promise = sut.add(makeFakeAccountData());
        await expect(promise).rejects.toThrow();
    });

    test('should call AddAccountRepository with correct values', async () => {
        const { sut, addAccountRepositoryStub } = makeSut();
        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
        await sut.add(makeFakeAccountData());
        expect(addSpy).toHaveBeenCalledWith({
            name: 'valid_name',
            email: 'valid_email@mail.com',
            password: 'hashed_password',
        });
    });

    test('should throw if AddAccountRepository throws', async () => {
        const { sut, addAccountRepositoryStub } = makeSut();
        jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error())),
        );
        const promise = sut.add(makeFakeAccountData());
        await expect(promise).rejects.toThrow();
    });

    test('should return an account on success', async () => {
        const { sut } = makeSut();
        const response = await sut.add(makeFakeAccountData());
        expect(response).toEqual(makeFakeAccount());
    });

    test('should call LoadAccountByEmailRepository with correct email', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut();
        const loadSpy = jest.spyOn(
            loadAccountByEmailRepositoryStub,
            'loadByEmail',
        );
        await sut.add(makeFakeAccountData());
        expect(loadSpy).toHaveBeenCalledWith('valid_email@mail.com');
    });
});
