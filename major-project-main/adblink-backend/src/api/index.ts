import { Router } from 'express';
import postsRouter from './posts/posts.router';
import usersRouter from './users/users.router';

export default (): Router => {
  const app = Router();

  console.log('In router');

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  usersRouter(app);
  postsRouter(app);

  return app;
};
