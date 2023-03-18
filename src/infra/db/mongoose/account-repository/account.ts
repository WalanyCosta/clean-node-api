import { AccountModel } from '../../../../domain/models/account-model';
import { AddAccountModel } from '../../../../domain/usecases/add-account';
import { AccountMongoose } from '../model/account-mongo-model';

export class AccountMongoRepository {
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
