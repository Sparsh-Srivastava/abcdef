import * as yup from 'yup';
import { TypeOf } from 'yup';

const MINIMUM_PASSWORD_LENGTH = 8;

export interface IUser {
  email: string;
  password: string;
  name: string;
  created_at: string;
}

export const YUserLoginRequest = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(MINIMUM_PASSWORD_LENGTH).required(),
});

export const YCreateUserRequest = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(MINIMUM_PASSWORD_LENGTH).required(),
});

export interface IUserLoginRequest extends TypeOf<typeof YUserLoginRequest> {}
export interface ICreateUserRequest extends TypeOf<typeof YCreateUserRequest> {}
