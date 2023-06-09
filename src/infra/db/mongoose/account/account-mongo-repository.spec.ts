import { AccountMongoRepository } from './account-mongo-repository';
import * as MongooseHelper from '../helpers/mongoose-helper';
import { AccountMongoose } from '../model/account-mongo-model';

describe('Account Mongo Repository', () => {
    beforeAll(async () => {
        await MongooseHelper.connect();
    });

    afterAll(async () => {
        await MongooseHelper.disconnect();
    });

    beforeEach(async () => {
        await MongooseHelper.cleanData();
    });

    const makeSut = (): AccountMongoRepository => {
        return new AccountMongoRepository();
    };

    test('should return an account on add success', async () => {
        const sut = makeSut();
        const account = await sut.add({
            name: 'any_name',
            email: 'any_email@mail.com',
            password: 'any_password',
        });
        expect(account).toBeTruthy();
        expect(account.id).toBeTruthy();
        expect(account.name).toBe('any_name');
        expect(account.email).toBe('any_email@mail.com');
        expect(account.password).toBe('any_password');
    });

    test('should return an account on loadByEmail success', async () => {
        const sut = makeSut();
        await new AccountMongoose({
            name: 'any_name',
            email: 'any_email@mail.com',
            password: 'any_password',
        }).save();
        const account = await sut.loadByEmail('any_email@mail.com');
        expect(account).toBeTruthy();
        expect(account.id).toBeTruthy();
        expect(account.name).toBe('any_name');
        expect(account.email).toBe('any_email@mail.com');
        expect(account.password).toBe('any_password');
    });

    test('should return null if loadByEmail fails', async () => {
        const sut = makeSut();
        const account = await sut.loadByEmail('any_email@mail.com');
        expect(account).toBeFalsy();
    });

    test('should update the account AccessToken on updateAccessToken success', async () => {
        const sut = makeSut();
        const fakeAccount = await new AccountMongoose({
            name: 'any_name',
            email: 'any_email@mail.com',
            password: 'any_password',
        }).save();
        expect(fakeAccount.accessToken).toBeFalsy();
        await sut.updateAccessToken(fakeAccount._id.toString(), 'any_token');
        const account = await AccountMongoose.findById({ _id: fakeAccount.id });
        expect(account).toBeTruthy();
        expect(account.accessToken).toBe('any_token');
    });
});
