export interface UpdateAccessTokenGenerator {
    updateAccessToken: (id: string, token: string) => Promise<void>;
}
