import { SignupController } from '../../../../presentation/controllers/signup/signup-controller';
import { Controller } from '../../../../presentation/protocols';
import { makeSignUpValidation } from './signup-validation-factory';
import { makeDbAuthentication } from '../../usecases/authentication/db-authentication-factory';
import { makeDbAddAccount } from '../../usecases/add-account/db-add-account-factory';
import { makeLogcontrollerDecorator } from '../../decorator/log-controller-decorator-factory';

export const makeSignUpController = (): Controller => {
    const controller = new SignupController(
        makeDbAddAccount(),
        makeSignUpValidation(),
        makeDbAuthentication(),
    );
    return makeLogcontrollerDecorator(controller);
};
