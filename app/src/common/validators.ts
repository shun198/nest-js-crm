import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isEmployeeNumber' })
export class IsEmployeeNumber implements ValidatorConstraintInterface {
  validate(text: string): Promise<boolean> | boolean {
    // 8桁の数字のみを許容する正規表現パターン
    const pattern = /^\d{8}$/;
    return typeof text === 'string' && pattern.test(text);
  }

  defaultMessage() {
    return '社員番号は8桁の数字でなければなりません';
  }
}
