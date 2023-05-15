import {
    CompareFieldValidation,
    EmailValidation,
    RequiredFieldValidation,
    ValidationComposite,
} from '../../../../presentation/helpers/validators';
import { Validation } from '../../../../presentation/protocols/validation';
import { EmailValidator } from '../../../../presentation/protocols/email-validator';
import { makeSignUpValidation } from './signup-validation-factory';

jest.mock('../../../../presentation/helpers/validators/validation-composite');

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true;
        }
    }

    return new EmailValidatorStub();
};

describe('SignUpValidation Factory', () => {
    test('should call ValidationComposite with all validations', () => {
        makeSignUpValidation();
        const validations: Validation[] = [];
        for (const field of ['name', 'email']) {
            validations.push(new RequiredFieldValidation(field));
        }
        validations.push(
            new CompareFieldValidation('password', 'passwordConfirmation'),
        );
        validations.push(new EmailValidation('email', makeEmailValidator()));
        expect(ValidationComposite).toHaveBeenCalledWith([
            new RequiredFieldValidation('name'),
            new RequiredFieldValidation('email'),
            new RequiredFieldValidation('password'),
            new RequiredFieldValidation('passwordConfirmation'),
            new CompareFieldValidation('password', 'passwordConfirmation'),
            new EmailValidation('email', makeEmailValidator()),
        ]);
    });
});
