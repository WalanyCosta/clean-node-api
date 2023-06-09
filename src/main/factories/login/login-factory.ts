import env from '../../config/env';
import { DbAuthentication } from '../../../data/usecase/authentication/db-authentication';
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter';
import { JwtAdapter } from '../../../infra/cryptography/jwt-adapter/jwt-adapter';
import { AccountMongoRepository } from '../../../infra/db/mongoose/account/account-mongo-repository';
import { LogMongoRepository } from '../../../infra/db/mongoose/log/log-mongo-repository';
import { LoginController } from '../../../presentation/controllers/login/login-controller';
import { Controller } from '../../../presentation/protocols';
import { LogControllerDecorator } from '../../decorators/log-controller-decorator';
import { makeLoginValidation } from './login-validation-factory';

export const makeLoginUpController = (): Controller => {
    const salt = 12;
    const bcryptAdapter = new BcryptAdapter(salt);
    const jwtAdapter = new JwtAdapter(env.jwtSecret);
    const accountMongoRepository = new AccountMongoRepository();
    const dbAuthentication = new DbAuthentication(
        accountMongoRepository,
        bcryptAdapter,
        jwtAdapter,
        accountMongoRepository,
    );
    const loginController = new LoginController(
        makeLoginValidation(),
        dbAuthentication,
    );
    const logMongoRepository = new LogMongoRepository();
    return new LogControllerDecorator(loginController, logMongoRepository);
};
