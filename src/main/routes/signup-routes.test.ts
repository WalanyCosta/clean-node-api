import request from 'supertest';
import app from '../config/app';

describe('CORS Middleware', () => {
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
