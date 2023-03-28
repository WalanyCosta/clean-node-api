import { CompareFieldComposite } from '../../presentation/helpers/validators/compare-field-validation';
import { RequiredFieldComposite } from '../../presentation/helpers/validators/required-field-validation';
import { Validation } from '../../presentation/helpers/validators/validation';
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite';
import { makeSignUpController } from './signup';

jest.mock('../../presentation/helpers/validators/validation-composite');

describe('SignUpValidation Factory', () => {
    test('should call ValidationComposite with all validations', () => {
        makeSignUpController();
        const validations: Validation[] = [];
        for (const field of ['name', 'email']) {
            validations.push(new RequiredFieldComposite(field));
        }
        validations.push(
            new CompareFieldComposite('password', 'passwordConfirmation'),
        );
        expect(ValidationComposite).toHaveBeenCalledWith([
            new RequiredFieldComposite('name'),
            new RequiredFieldComposite('email'),
            new RequiredFieldComposite('password'),
            new RequiredFieldComposite('passwordConfirmation'),
            new CompareFieldComposite('password', 'passwordConfirmation'),
        ]);
    });
});
