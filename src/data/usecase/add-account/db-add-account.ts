import { AddAccountRepository } from '../../protocols/db/account/add-account-repository';
import {
    Hasher,
    AddAccountModel,
    AccountModel,
    AddAccount,
} from './db-add-account-protocols';

export class DbAddAccount implements AddAccount {
    constructor(
        private readonly hasher: Hasher,
        private readonly addAccountRepository: AddAccountRepository,
    ) {}

    async add(accountData: AddAccountModel): Promise<AccountModel> {
        const hashPassword = await this.hasher.hash(accountData.password);
        const account = await this.addAccountRepository.add({
            name: accountData.name,
            email: accountData.email,
            password: hashPassword,
        });
        return account;
    }
}
