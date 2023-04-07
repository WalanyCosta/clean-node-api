import {
    badRequest,
    ok,
    serverError,
    unauthorizedError,
} from '../../helpers/http/http-helper';
import {
    Authentication,
    Validation,
    Controller,
    HttpRequest,
    HttpResponse,
} from './login-controller-protocols';

export class LoginController implements Controller {
    constructor(
        private readonly validation: Validation,
        private readonly authentication: Authentication,
    ) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const error = this.validation.validate(httpRequest.body);
            if (error) {
                return badRequest(error);
            }
            const { email, password } = httpRequest.body;

            const accessToken = await this.authentication.auth({
                email,
                password,
            });
            if (!accessToken) {
                return unauthorizedError();
            }

            return ok({ accessToken });
        } catch (error) {
            return serverError(error);
        }
    }
}
