import database from '../../loaders/database';
import { sign } from '../../utils/jwt';
import { compare, hash } from 'bcrypt';
import { ICreateUserRequest, IUser, IUserLoginRequest, YCreateUserRequest, YUserLoginRequest } from './users.types';
import { APIError } from '../../utils/error';

export const USERS_COLLECTION = 'users';
const SALT_ROUNDS = 12;

const handleLogin = async (payload: any) => {
  // Validate body...
  if (!(await YUserLoginRequest.isValid(payload))) {
    throw new APIError(422, 'Validation failed...');
  }

  const db = await database();
  const { email, password } = payload as IUserLoginRequest;

  // Check if user exists...
  const user = await db.collection(USERS_COLLECTION).findOne({ email });
  if (!user) {
    throw new APIError(404, 'User not found');
  }

  // Match hash...
  const match = await compare(password, user.password);
  if (!match) {
    throw new APIError(404, 'User not found');
  }

  // Create JWT token...
  return { token: 'Bearer ' + sign({ email }) };
};

const createUser = async (payload: any) => {
  // Validate body...
  if (!(await YCreateUserRequest.isValid(payload))) {
    throw new APIError(422, 'Validation failed...');
  }

  const db = await database();
  const { email, password, name } = payload as ICreateUserRequest;

  // Check if user exists...
  const user = await db.collection(USERS_COLLECTION).findOne({ email });
  if (user) {
    throw new APIError(409, 'User already exists');
  }

  // Hash password...
  const hashedPassword = await hash(password, SALT_ROUNDS);

  // Create user...
  const candidateUser: IUser = { email, password: hashedPassword, name, created_at: new Date().toISOString() };
  await db.collection(USERS_COLLECTION).insertOne(candidateUser);

  delete candidateUser.password;
  return { user: candidateUser };
};

export { handleLogin, createUser };
