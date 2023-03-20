import { LogErrorRepository } from '../../data/protocols/log-error-repository';
import { HttpRequest, HttpResponse } from '../../presentation/protocols';
import { Controller } from './../../presentation/protocols/controller';

export class LogControllerDecorator implements Controller {
    private readonly controller: Controller;
    private readonly logErrorRepository: LogErrorRepository;

    constructor(
        controller: Controller,
        logErrorRepository: LogErrorRepository,
    ) {
        this.controller = controller;
        this.logErrorRepository = logErrorRepository;
    }

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse = await this.controller.handle(httpRequest);
        if (httpResponse.statusCode === 500) {
            this.logErrorRepository.logError(httpResponse.body.stack);
        }
        return httpResponse;
    }
}
