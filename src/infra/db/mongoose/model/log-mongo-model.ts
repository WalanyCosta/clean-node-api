import { Schema, model } from 'mongoose';

interface IError {
    stack: string;
    date: Date;
}

const ErrorSchema = new Schema<IError>({
    stack: { type: String },
    date: { type: Date },
});

export const ErrorMongoose = model<IError>('errors', ErrorSchema);
