import { SignupController } from '../../presentation/controllers/signup/signup';
import { EmailValidatorAdapter } from './../../utils/email-validator-adapter';
import { DbAddAccount } from './../../data/usecase/add-account/db-add-account';
import { BcryptAdapter } from './../../infra/cryptography/bcrypt-adapter';
import { AccountMongoRepository } from './../../infra/db/mongoose/account-repository/account';

export const makeSignUpController = (): SignupController => {
    const salt = 12;
    const accountMongoRepository = new AccountMongoRepository();
    const bcryptAdapter = new BcryptAdapter(salt);
    const dbAddAccount = new DbAddAccount(
        bcryptAdapter,
        accountMongoRepository,
    );
    const emailValidatorAdapter = new EmailValidatorAdapter();
    return new SignupController(emailValidatorAdapter, dbAddAccount);
};
