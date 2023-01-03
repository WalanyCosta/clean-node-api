import { MissingParamError, InvalidParamError } from '../errors';
import { badRequest, serverError } from '../helpers/http-helper';
import {
    HttpRequest,
    HttpResponse,
    EmailValidator,
    Controller,
} from '../protocols';

export class SignupController implements Controller {
    private readonly emailValidator: EmailValidator;

    constructor(emailValidator: EmailValidator) {
        this.emailValidator = emailValidator;
    }

    handle(httpRequest: HttpRequest): HttpResponse {
        try {
            const requiredFields = [
                'name',
                'email',
                'password',
                'passwordConfirmation',
            ];
            for (const field of requiredFields) {
                if (!httpRequest.body[field])
                    return badRequest(new MissingParamError(field));
            }
            const { email, password, passwordConfirmation } = httpRequest.body;
            if (passwordConfirmation !== password) {
                return badRequest(
                    new InvalidParamError('passwordConfirmation'),
                );
            }
            const isValid = this.emailValidator.isValid(email);

            if (!isValid) {
                return badRequest(new InvalidParamError(email));
            }

            return {
                statusCode: 200,
            };
        } catch (error) {
            return serverError();
        }
    }
}
