import request from 'supertest';
import app from '../config/app';
import * as MongooseHelper from '../../infra/db/mongoose/helpers/mongoose-helper';

describe('CORS Middleware', () => {
    beforeAll(async () => {
        await MongooseHelper.connect();
    });

    afterAll(async () => {
        await MongooseHelper.disconnect();
    });

    beforeEach(async () => {
        await MongooseHelper.cleanData();
    });
    test('should return an account on success', async () => {
        await request(app)
            .post('/api/signup')
            .send({
                name: 'any_name',
                email: 'any_email@mail.com',
                password: '123',
                passwordConfirmation: '123',
            })
            .expect(200);
    });
});
