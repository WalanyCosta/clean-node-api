import { DbAddAccount } from '../../../../data/usecase/add-account/db-add-account';
import { AddAccount } from '../../../../domain/usecases/add-account';
import { BcryptAdapter } from '../../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter';
import { AccountMongoRepository } from '../../../../infra/db/mongoose/account/account-mongo-repository';

export const makeDbAddAccount = (): AddAccount => {
    const salt = 12;
    const accountMongoRepository = new AccountMongoRepository();
    const bcryptAdapter = new BcryptAdapter(salt);
    return new DbAddAccount(bcryptAdapter, accountMongoRepository);
};