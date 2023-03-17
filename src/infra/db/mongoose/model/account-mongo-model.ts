import { Schema, model } from 'mongoose';

interface IAccount {
    name: string;
    email: string;
    password: string;
}

const AccountSchema = new Schema<IAccount>({
    name: { type: String },
    email: { type: String },
    password: { type: String },
});

export const AccountMongoose = model<IAccount>('accounts', AccountSchema);
