import { LogErrorRepository } from '../../../../data/protocols/db/log/log-error-repository';
import { ErrorMongoose } from '../model/log-mongo-model';

export class LogMongoRepository implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
        const errorCollection = new ErrorMongoose({ stack, date: new Date() });
        await errorCollection.save();
    }
}
