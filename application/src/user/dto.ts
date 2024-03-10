export class CreateUserDto {
  name: string;
  employee_number: string;
  email: string;
  password: string;
  is_active?: boolean;
}

export class UpdateUserDto {
  name?: string;
  employee_number?: string;
  email?: string;
  password?: string;
  is_active?: boolean;
}
