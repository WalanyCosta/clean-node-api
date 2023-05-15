import { LoginController } from '../../../../presentation/controllers/login/login-controller';
import { Controller } from '../../../../presentation/protocols';
import { makeLogcontrollerDecorator } from '../../decorator/log-controller-decorator-factory';
import { makeDbAuthentication } from '../../usecases/authentication/db-authentication-factory';
import { makeLoginValidation } from './login-validation-factory';

export const makeLoginUpController = (): Controller => {
    const controller = new LoginController(
        makeLoginValidation(),
        makeDbAuthentication(),
    );
    return makeLogcontrollerDecorator(controller);
};
