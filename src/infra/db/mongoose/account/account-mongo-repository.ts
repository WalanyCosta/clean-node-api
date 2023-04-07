import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/account/load-account-by-email-repository';
import { UpdateAccessTokenGenerator } from '../../../../data/protocols/db/account/update-access-token-generator';
import { AccountModel } from '../../../../domain/models/account-model';
import { AddAccountModel } from '../../../../domain/usecases/add-account';
import { AccountMongoose } from '../model/account-mongo-model';
import { AddAccountRepository } from '../../../../data/protocols/db/account/add-account-repository';
import * as MongooseHelper from '../helpers/mongoose-helper';

export class AccountMongoRepository
    implements
        AddAccountRepository,
        LoadAccountByEmailRepository,
        UpdateAccessTokenGenerator
{
    async add(accountData: AddAccountModel): Promise<AccountModel> {
        const account = new AccountMongoose(accountData);
        const result = await account.save();
        return MongooseHelper.map(result);
    }

    async loadByEmail(email: string): Promise<AccountModel> {
        const account = await AccountMongoose.findOne({ email });
        return MongooseHelper.map(account);
    }

    async updateAccessToken(id: string, token: string): Promise<void> {
        await AccountMongoose.updateOne(
            { _id: id },
            { $set: { accessToken: token } },
        );
    }
}
