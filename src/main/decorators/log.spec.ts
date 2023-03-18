import {
    Controller,
    HttpRequest,
    HttpResponse,
} from '../../presentation/protocols';
import { LogControllerDecorator } from './log';

class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse: HttpResponse = {
            statusCode: 200,
            body: {
                name: 'walany',
            },
        };
        return new Promise(resolve => resolve(httpResponse));
    }
}

describe('LogController Decorator', () => {
    test('should call controller handle', async () => {
        const controllerStub = new ControllerStub();
        const handleSpy = jest.spyOn(controllerStub, 'handle');
        const sut = new LogControllerDecorator(controllerStub);
        const httpRequest = {
            body: {
                email: 'any_mail@mail.com',
                nmae: 'any_name',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            },
        };
        await sut.handle(httpRequest);
        expect(handleSpy).toHaveBeenCalledWith(httpRequest);
    });
});
