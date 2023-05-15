import { Request, Response, NextFunction } from 'express';
import database from '../loaders/database';
import { verify } from '../utils/jwt';
import { USERS_COLLECTION } from '../api/users/users.controller';
import { IUser } from '../api/users/users.types';

type ValidateUserMiddlewareOptions = {
  attachUser?: boolean;
};

const validateUser = ({ attachUser = false }: ValidateUserMiddlewareOptions) => async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { authorization } = req.headers;

  const token = authorization && authorization.split(' ')[1];
  if (token === undefined) {
    return res.status(401).json({ success: false });
  }

  try {
    const result = verify(token);
    if (attachUser) {
      const db = await database();
      const user: IUser = await db.collection(USERS_COLLECTION).findOne({ email: result.email });

      if (!user) {
        throw Error();
      }

      delete user.password;
      res.locals.user = user;
    }
    next();
  } catch (e) {
    return res.status(401).json({ success: false });
  }
};

export { validateUser };
