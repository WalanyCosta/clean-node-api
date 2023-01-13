import { MongoClient } from 'mongodb';

export const MongoHelper = {
    client: null,
    async connect(url: string): Promise<void> {
        this.client = await MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as any);
    },
    async disconnect(): Promise<void> {
        await this.client.close();
    },
};
