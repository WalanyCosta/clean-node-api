import { CompareFieldComposite } from '../../presentation/helpers/validators/compare-field-validation';
import { RequiredFieldComposite } from '../../presentation/helpers/validators/required-field-validation';
import { Validation } from '../../presentation/helpers/validators/validation';
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite';

export const makeSignUpValidation = (): Validation => {
    return new ValidationComposite([
        new RequiredFieldComposite('name'),
        new RequiredFieldComposite('email'),
        new RequiredFieldComposite('password'),
        new RequiredFieldComposite('passwordConfirmation'),
        new CompareFieldComposite('password', 'passwordConfirmation'),
    ]);
};
