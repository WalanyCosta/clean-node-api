import { AccountModel } from '../../../../domain/models/account-model';
import { AddAccountModel } from '../../../../domain/usecases/add-account';
import { AccountMongoose } from '../model/account-mongo-model';
import { AddAccountRepository } from './../../../../data/protocols/db/add-account-repository';

export class AccountMongoRepository implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
        const account = new AccountMongoose(accountData);
        const result = await account.save();
        return {
            id: result._id.toString(),
            name: result.name,
            email: result.email,
            password: result.password,
        };
    }
}
