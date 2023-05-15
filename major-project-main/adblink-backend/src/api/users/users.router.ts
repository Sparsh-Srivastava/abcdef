import { Router, Request, Response } from 'express';
import { createUser, handleLogin } from './users.controller';
import { respondWithError } from '../../utils/error';
import { validateUser } from '../../middlewares/user.auth';

const route = Router();

export default (app: Router) => {
  app.use('/users', route);

  route.post('/login', async (req: Request, res: Response) => {
    try {
      const body = await handleLogin(req.body);
      console.log(body);
      return res.status(200).json({ success: true, ...body });
    } catch (e) {
      console.log(req.body);
      respondWithError(e, res);
    }
  });

  route.post('/', async (req: Request, res: Response) => {
    try {
      const body = await createUser(req.body);
      console.log(body);
      return res.status(201).json({ success: true, ...body });
    } catch (e) {
      console.log({ body: req.body, message: 'Error creating user' });
      respondWithError(e, res);
    }
  });

  route.get('/', validateUser({ attachUser: true }), async (req: Request, res: Response) => {
    const user = res.locals.user;
    delete user._id;
    return res.status(200).json({ success: true, user });
  });
};
