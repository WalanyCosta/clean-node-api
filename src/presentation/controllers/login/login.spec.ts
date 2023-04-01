import { LoginController } from './login';
import {
    badRequest,
    ok,
    serverError,
    unauthorizedError,
} from '../../helpers/http/http-helper';
import { MissingParamError } from '../../errors';
import {
    Validation,
    HttpRequest,
    Authentication,
    AuthenticationModel,
} from './login-protocols';

const makeValidation = (): Validation => {
    class ValidationStub implements Validation {
        validate(input: any): Error {
            return null;
        }
    }

    return new ValidationStub();
};

const makeAuthentication = (): Authentication => {
    class AuthenticationStub implements Authentication {
        async auth(authentication: AuthenticationModel): Promise<string> {
            return new Promise(resolve => resolve('any_token'));
        }
    }

    return new AuthenticationStub();
};

const makeFakeRequest = (): HttpRequest => ({
    body: {
        email: 'any_email@mail.com',
        password: 'any_password',
    },
});

interface SutTypes {
    sut: LoginController;
    validationStub: Validation;
    authenticationStub: Authentication;
}

const makeSut = (): SutTypes => {
    const validationStub = makeValidation();
    const authenticationStub = makeAuthentication();
    const sut = new LoginController(validationStub, authenticationStub);

    return {
        sut,
        validationStub,
        authenticationStub,
    };
};

describe('Login Controller', () => {
    test('should call authentication with correct values', async () => {
        const { sut, authenticationStub } = makeSut();
        const authSpy = jest.spyOn(authenticationStub, 'auth');
        await sut.handle(makeFakeRequest());
        expect(authSpy).toHaveBeenCalledWith({
            email: 'any_email@mail.com',
            password: 'any_password',
        });
    });

    test('should return 401 if invalid credentials are provided', async () => {
        const { sut, authenticationStub } = makeSut();
        jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(
            new Promise(resolve => resolve(null)),
        );
        const httpResponse = await sut.handle(makeFakeRequest());
        expect(httpResponse).toEqual(unauthorizedError());
    });

    test('should return 500 if Authenticaton throws', async () => {
        const { sut, authenticationStub } = makeSut();
        jest.spyOn(authenticationStub, 'auth').mockRejectedValueOnce(
            new Error(),
        );
        const httpResponse = await sut.handle(makeFakeRequest());
        expect(httpResponse).toEqual(serverError(new Error()));
    });

    test('should return 200 if valid credentials are provided', async () => {
        const { sut } = makeSut();
        const httpResponse = await sut.handle(makeFakeRequest());
        expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }));
    });

    test('should call Validation with correct email', async () => {
        const { sut, validationStub } = makeSut();
        const validateSpy = jest.spyOn(validationStub, 'validate');
        const httpRequest = makeFakeRequest();
        await sut.handle(makeFakeRequest());
        expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
    });

    test('should return 400 if Validation returns an error', async () => {
        const { sut, validationStub } = makeSut();
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(
            new MissingParamError('any_field'),
        );
        const httpResponse = await sut.handle(makeFakeRequest());
        expect(httpResponse).toEqual(
            badRequest(new MissingParamError('any_field')),
        );
    });
});
