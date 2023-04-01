import {
    badRequest,
    ok,
    serverError,
    unauthorizedError,
} from '../../helpers/http-helper';
import {
    Authentication,
    Validation,
    Controller,
    HttpRequest,
    HttpResponse,
} from './login-protocols';

export class LoginController implements Controller {
    private readonly validation: Validation;
    private readonly authentication: Authentication;

    constructor(validation: Validation, authentication: Authentication) {
        this.validation = validation;
        this.authentication = authentication;
    }

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const error = this.validation.validate(httpRequest.body);
            if (error) {
                return badRequest(error);
            }
            const { email, password } = httpRequest.body;

            const accessToken = await this.authentication.auth(email, password);
            if (!accessToken) {
                return unauthorizedError();
            }

            return ok({ accessToken });
        } catch (error) {
            return serverError(error);
        }
    }
}
