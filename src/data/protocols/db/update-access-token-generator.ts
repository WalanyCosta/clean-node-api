export interface UpdateAccessTokenGenerator {
    update: (id: string, token: string) => Promise<void>;
}
