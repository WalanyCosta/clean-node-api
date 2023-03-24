import { LoginController } from './login';
import { badRequest } from '../../helpers/http-helper';
import { MissingParamError } from '../../errors';

describe('Login Controller', () => {
    test('should return 400 if no email is provided', async () => {
        const sut = new LoginController();
        const httpRequest = {
            body: {
                password: 'any_password',
            },
        };
        const httpReponse = await sut.handle(httpRequest);
        expect(httpReponse).toEqual(badRequest(new MissingParamError('email')));
    });
});
