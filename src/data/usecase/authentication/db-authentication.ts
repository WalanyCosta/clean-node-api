import {
    AuthenticationModel,
    Authentication,
    HashComparer,
    Encrypter,
    LoadAccountByEmailRepository,
    UpdateAccessTokenGenerator,
} from './db-authentication-protocols';

export class DbAuthentication implements Authentication {
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;
    private readonly hashComparer: HashComparer;
    private readonly encrypter: Encrypter;
    private readonly updateAccessTokenGenerator: UpdateAccessTokenGenerator;

    constructor(
        loadAccountByEmailRepository: LoadAccountByEmailRepository,
        hashComparer: HashComparer,
        encrypter: Encrypter,
        updateAccessTokenGenerator: UpdateAccessTokenGenerator,
    ) {
        this.loadAccountByEmailRepository = loadAccountByEmailRepository;
        this.hashComparer = hashComparer;
        this.encrypter = encrypter;
        this.updateAccessTokenGenerator = updateAccessTokenGenerator;
    }

    async auth(authentication: AuthenticationModel): Promise<string> {
        const account = await this.loadAccountByEmailRepository.load(
            authentication.email,
        );

        if (account) {
            const isValid = await this.hashComparer.compare(
                authentication.password,
                account.password,
            );

            if (isValid) {
                const accessToken = await this.encrypter.encrypt(account.id);
                await this.updateAccessTokenGenerator.updateAccessToken(
                    account.id,
                    accessToken,
                );
                return accessToken;
            }
        }

        return null;
    }
}
