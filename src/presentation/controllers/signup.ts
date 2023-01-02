import { InvalidParamError } from '../errors/Invalid-param-error';
import { MissingParamError } from '../errors/missing-param-error';
import { badRequest } from '../helpers/http-helper';
import { Controller } from '../protocols/controller';
import { EmailValidator } from '../protocols/email-validator';
import { HttpRequest, HttpResponse } from '../protocols/http';

export class SignupController implements Controller {
    private readonly emailValidator: EmailValidator;

    constructor(emailValidator: EmailValidator) {
        this.emailValidator = emailValidator;
    }

    handle(httpRequest: HttpRequest): HttpResponse {
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

        const isValid = this.emailValidator.isValid(httpRequest.body.email);

        if (!isValid) {
            return badRequest(new InvalidParamError(httpRequest.body.email));
        }

        return {
            statusCode: 200,
        };
    }
}
