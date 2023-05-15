import { LogControllerDecorator } from '../../decorators/log-controller-decorator';
import { Controller } from '../../../presentation/protocols';
import { LogMongoRepository } from '../../../infra/db/mongoose/log/log-mongo-repository';

export const makeLogcontrollerDecorator = (
    controller: Controller,
): Controller => {
    const logMongoRepository = new LogMongoRepository();
    return new LogControllerDecorator(controller, logMongoRepository);
};
