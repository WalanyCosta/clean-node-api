import { AddAccountRepository } from '../../protocols/add-account-repository';
import { Encrypter, AddAccountModel } from './db-add-account-protocols';

export class DbAddAccount {
    private readonly encripter: Encrypter;
    private readonly addAccountRepository: AddAccountRepository;

    constructor(
        encripter: Encrypter,
        addAccountRepository: AddAccountRepository,
    ) {
        this.encripter = encripter;
        this.addAccountRepository = addAccountRepository;
    }

    async add(account: AddAccountModel): Promise<any> {
        const hashPassword = await this.encripter.encrypt(account.password);
        return await this.addAccountRepository.add({
            name: account.name,
            email: account.email,
            password: hashPassword,
        });
    }
}
