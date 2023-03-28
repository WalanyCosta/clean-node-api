import { Validation } from './validation';

export class ValidationComposite implements Validation {
    private readonly validatons: Validation[];

    constructor(validatons: Validation[]) {
        this.validatons = validatons;
    }

    validate(input: any): Error {
        for (const validation of this.validatons) {
            const error = validation.validate(input);
            if (error) {
                return error;
            }
        }
    }
}
