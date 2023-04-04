import {
    AuthenticationModel,
    Authentication,
    HashComparer,
    TokenGenerator,
    LoadAccountByEmailRepository,
    UpdateAccessTokenGenerator,
} from './db-authentication-protocols';

export class DbAuthentication implements Authentication {
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;
    private readonly hashComparer: HashComparer;
    private readonly tokenGenerator: TokenGenerator;
    private readonly updateAccessTokenGenerator: UpdateAccessTokenGenerator;

    constructor(
        loadAccountByEmailRepository: LoadAccountByEmailRepository,
        hashComparer: HashComparer,
        tokenGenerator: TokenGenerator,
        updateAccessTokenGenerator: UpdateAccessTokenGenerator,
    ) {
        this.loadAccountByEmailRepository = loadAccountByEmailRepository;
        this.hashComparer = hashComparer;
        this.tokenGenerator = tokenGenerator;
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
                const accessToken = await this.tokenGenerator.generate(
                    account.id,
                );
                await this.updateAccessTokenGenerator.update(
                    account.id,
                    accessToken,
                );
                return accessToken;
            }
        }

        return null;
    }
}
