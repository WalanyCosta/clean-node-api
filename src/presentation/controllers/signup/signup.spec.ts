import {
    AccountModel,
    AddAccount,
    AddAccountModel,
    EmailValidator,
    HttpRequest,
} from './signup-protocols';
import {
    MissingParamError,
    InvalidParamError,
    ServerError,
} from '../../errors';
import { SignupController } from './signup';
import { ok, serverError, badRequest } from '../../helpers/http-helper';

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true;
        }
    }

    return new EmailValidatorStub();
};

const makeAddAccount = (): AddAccount => {
    class AddAccountStub implements AddAccount {
        async add(account: AddAccountModel): Promise<AccountModel> {
            return await Promise.resolve(makeFakeAccount());
        }
    }

    return new AddAccountStub();
};

const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@gmail.com',
    password: 'valid_password',
});

const makeFakeRequest = (): HttpRequest => ({
    body: {
        name: 'any_name',
        password: 'any_password',
        email: 'any_email@gmail.com',
        passwordConfirmation: 'any_password',
    },
});

interface SutTypes {
    sut: SignupController;
    emailValidatorStub: EmailValidator;
    addAccountStub: AddAccount;
}

const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidator();
    const addAccountStub = makeAddAccount();
    const sut = new SignupController(emailValidatorStub, addAccountStub);
    return {
        sut,
        emailValidatorStub,
        addAccountStub,
    };
};

describe('Signup controller', () => {
    test('should return 400 if no name is provided', async () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                email: 'any_email@gmail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            },
        };
        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse).toEqual(badRequest(new MissingParamError('name')));
    });

    test('should return 400 if no email is provided', async () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                name: 'any_name',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            },
        };
        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse).toEqual(
            badRequest(new MissingParamError('email')),
        );
    });

    test('should return 400 if no password is provided', async () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email',
                passwordConfirmation: 'any_password',
            },
        };
        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse).toEqual(
            badRequest(new MissingParamError('password')),
        );
    });

    test('should return 400 if no passwordConfirmation is provided', async () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email',
                password: 'any_password',
            },
        };
        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse).toEqual(
            badRequest(new MissingParamError('passwordConfirmation')),
        );
    });

    test('should return 400 if passwordConfirmation fails', async () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email',
                password: 'any_password',
                passwordConfirmation: 'another_password',
            },
        };
        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse).toEqual(
            badRequest(new InvalidParamError('passwordConfirmation')),
        );
    });

    test('should return 400 if an invalid email is provided', async () => {
        const { sut, emailValidatorStub } = makeSut();
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
        const httpResponse = await sut.handle(makeFakeRequest());
        expect(httpResponse).toEqual(
            badRequest(new InvalidParamError('email')),
        );
    });

    test('should call EmailValidator with correct email', async () => {
        const { sut, emailValidatorStub } = makeSut();
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
        await sut.handle(makeFakeRequest());
        expect(isValidSpy).toHaveBeenCalledWith('any_email@gmail.com');
    });

    test('should return 500 if EmailValidator throws', async () => {
        const { sut, emailValidatorStub } = makeSut();
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error();
        });
        const httpResponse = await sut.handle(makeFakeRequest());
        expect(httpResponse).toEqual(serverError(new ServerError(null)));
    });

    test('should call AddAccount with correct email', async () => {
        const { sut, addAccountStub } = makeSut();
        const addSpy = jest.spyOn(addAccountStub, 'add');
        await sut.handle(makeFakeRequest());
        expect(addSpy).toHaveBeenCalledWith({
            name: 'any_name',
            email: 'any_email@gmail.com',
            password: 'any_password',
        });
    });

    test('should return 500 if AddAccount throws', async () => {
        const { sut, addAccountStub } = makeSut();
        jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
            return await Promise.reject(new Error());
        });
        const httpResponse = await sut.handle(makeFakeRequest());
        expect(httpResponse).toEqual(serverError(new ServerError(null)));
    });

    test('should return 200 if valid data is provided', async () => {
        const { sut } = makeSut();
        const httpResponse = await sut.handle(makeFakeRequest());
        expect(httpResponse).toEqual(ok(makeFakeAccount()));
    });
});