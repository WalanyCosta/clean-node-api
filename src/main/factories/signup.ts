import { SignupController } from '../../presentation/controllers/signup/signup';
import { DbAddAccount } from './../../data/usecase/add-account/db-add-account';
import { BcryptAdapter } from './../../infra/cryptography/bcrypt-adapter';
import { AccountMongoRepository } from './../../infra/db/mongoose/account-repository/account';
import { LogControllerDecorator } from '../decorators/log';
import { Controller } from '../../presentation/protocols';
import { LogMongoRepository } from './../../infra/db/mongoose/log-repository/log';
import { makeSignUpValidation } from './signup-validation';

export const makeSignUpController = (): Controller => {
    const salt = 12;
    const accountMongoRepository = new AccountMongoRepository();
    const bcryptAdapter = new BcryptAdapter(salt);
    const dbAddAccount = new DbAddAccount(
        bcryptAdapter,
        accountMongoRepository,
    );
    const validationComposite = makeSignUpValidation();
    const signupController = new SignupController(
        dbAddAccount,
        validationComposite,
    );
    const logMongoRepository = new LogMongoRepository();
    return new LogControllerDecorator(signupController, logMongoRepository);
};
