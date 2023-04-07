import { Schema, model } from 'mongoose';

interface IAccount {
    name: string;
    email: string;
    password: string;
    accessToken?: string;
}

const AccountSchema = new Schema<IAccount>({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    accessToken: { type: String },
});

export const AccountMongoose = model<IAccount>('accounts', AccountSchema);
