import { AddAccountRepository } from '../../protocols/add-account-repository';
import {
    Encrypter,
    AddAccountModel,
    AccountModel,
    AddAccount,
} from './db-add-account-protocols';

export class DbAddAccount implements AddAccount {
    private readonly encripter: Encrypter;
    private readonly addAccountRepository: AddAccountRepository;

    constructor(
        encripter: Encrypter,
        addAccountRepository: AddAccountRepository,
    ) {
        this.encripter = encripter;
        this.addAccountRepository = addAccountRepository;
    }

    async add(accountData: AddAccountModel): Promise<AccountModel> {
        const hashPassword = await this.encripter.encrypt(accountData.password);
        const account = await this.addAccountRepository.add({
            name: accountData.name,
            email: accountData.email,
            password: hashPassword,
        });
        return account;
    }
}
