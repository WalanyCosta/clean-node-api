import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoDb: MongoMemoryServer;

export const connect = async (uriParam = '') => {
    if (uriParam === '') {
        mongoDb = await MongoMemoryServer.create();
    }
    const uri = mongoDb?.getUri() || uriParam;
    await mongoose.connect(uri);
};

export const cleanData = async () => {
    await mongoose.connection.db.dropDatabase();
};

export const disconnect = async () => {
    await mongoose.disconnect();
    if (mongoDb) await mongoDb?.stop();
};

export const map = (account: any) => {
    return (
        account && {
            id: account._id.toString(),
            name: account.name,
            email: account.email,
            password: account.password,
        }
    );
};
