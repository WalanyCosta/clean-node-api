import * as MongooseHelper from '../helpers/mongoose-helper';
import { ErrorMongoose } from '../model/log-mongo-model';
import { LogMongoRepository } from './log';

const makeSut = (): LogMongoRepository => {
    return new LogMongoRepository();
};

describe('Log Mongo Repository', () => {
    beforeAll(async () => {
        await MongooseHelper.connect();
    });

    afterAll(async () => {
        await MongooseHelper.disconnect();
    });

    beforeEach(async () => {
        await MongooseHelper.cleanData();
    });
    test('should create an error log on success', async () => {
        const sut = makeSut();
        await sut.logError('any_error');
        const errors = new ErrorMongoose();
        const counts = await errors.collection.countDocuments();
        expect(counts).toBe(1);
    });
});
