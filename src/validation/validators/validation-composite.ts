import { Validation } from '../../presentation/protocols';

export class ValidationComposite implements Validation {
    constructor(private readonly validatons: Validation[]) {}

    validate(input: any): Error {
        for (const validation of this.validatons) {
            const error = validation.validate(input);
            if (error) {
                return error;
            }
        }
    }
}
