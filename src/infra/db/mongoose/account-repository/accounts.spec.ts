import { AccountMongoRepository } from './account';
import * as MongooseHelper from '../helpers/mongoose-helper';

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

    it('should mongoose', async () => {
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
});
