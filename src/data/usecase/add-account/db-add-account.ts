import { Encrypter, AddAccountModel } from './db-add-account-protocols';

export class DbAddAccount {
    private readonly encripter: Encrypter;

    constructor(encripter: Encrypter) {
        this.encripter = encripter;
    }

    async add(account: AddAccountModel): Promise<any> {
        await this.encripter.encrypt(account.password);
        return await new Promise(resolve => resolve(null));
    }
}
