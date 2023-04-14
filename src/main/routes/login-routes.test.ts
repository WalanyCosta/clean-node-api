import request from 'supertest';
import app from '../config/app';
import * as MongooseHelper from '../../infra/db/mongoose/helpers/mongoose-helper';
import { AccountMongoose } from '../../infra/db/mongoose/model/account-mongo-model';
import { hash } from 'bcrypt';

describe('Login Routes', () => {
    beforeAll(async () => {
        await MongooseHelper.connect();
    });

    afterAll(async () => {
        await MongooseHelper.disconnect();
    });

    beforeEach(async () => {
        await MongooseHelper.cleanData();
    });

    describe('Post /signup', () => {
        test('should return 200 on signup', async () => {
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

    describe('Post /login', () => {
        test('should return 200 on login', async () => {
            const password = await hash('123', 12);
            await new AccountMongoose({
                name: 'any_name',
                email: 'any_email@mail.com',
                password,
            }).save();

            await request(app)
                .post('/api/login')
                .send({
                    email: 'any_email@mail.com',
                    password: '123',
                })
                .expect(200);
        });
    });
});
