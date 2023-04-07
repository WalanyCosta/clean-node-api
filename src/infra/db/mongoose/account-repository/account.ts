import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/load-account-by-email-repository';
import { UpdateAccessTokenGenerator } from '../../../../data/protocols/db/update-access-token-generator';
import { AccountModel } from '../../../../domain/models/account-model';
import { AddAccountModel } from '../../../../domain/usecases/add-account';
import { AccountMongoose } from '../model/account-mongo-model';
import { AddAccountRepository } from './../../../../data/protocols/db/add-account-repository';

export class AccountMongoRepository
    implements
        AddAccountRepository,
        LoadAccountByEmailRepository,
        UpdateAccessTokenGenerator
{
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

    async loadByEmail(email: string): Promise<AccountModel> {
        const account = await AccountMongoose.findOne({ email });
        return (
            account && {
                id: account._id.toString(),
                name: account.name,
                email: account.email,
                password: account.password,
            }
        );
    }

    async updateAccessToken(id: string, token: string): Promise<void> {
        await AccountMongoose.updateOne(
            { _id: id },
            { $set: { accessToken: token } },
        );
    }
}
