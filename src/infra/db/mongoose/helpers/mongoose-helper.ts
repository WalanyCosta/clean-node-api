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

export const disconnect = async () => {
    await mongoose.disconnect();
    if (mongoDb) await mongoDb?.stop();
};
