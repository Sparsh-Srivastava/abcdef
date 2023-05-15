import { Router, Request, Response } from 'express';
import { createPost, deletePost, fetchPost, fetchPosts, findPostWithCategory, handleUpload } from './posts.controller';
import { respondWithError } from '../../utils/error';
import { validateUser } from '../../middlewares/user.auth';

const route = Router();

export default (app: Router) => {
  app.get('/posts/:category', async (req: Request, res: Response) => {
    try {
      const category = req.params.category;
      const post = await findPostWithCategory(category);
      res.status(200).json({ success: true, img: post.file_name, url: post.redirect_url });
    } catch (error) {
      respondWithError(error, res);
    }
  });

  app.use('/posts', validateUser({ attachUser: true }), route);

  route.post('/', async (req: Request, res: Response) => {
    try {
      const post = await createPost(req.body, res.locals.user);
      return res.status(201).json({ success: true, post });
    } catch (e) {
      console.log(e);
      respondWithError(e, res);
    }
  });

  route.get('/', async (req: Request, res: Response) => {
    try {
      const posts = await fetchPosts(res.locals.user);
      return res.status(200).json({ success: true, posts });
    } catch (e) {
      respondWithError(e, res);
    }
  });

  route.get('/:id', async (req: Request, res: Response) => {
    try {
      const post = await fetchPost(req.params, res.locals.user);
      return res.status(200).json({ success: true, post });
    } catch (e) {
      console.error(e);
      respondWithError(e, res);
    }
  });

  route.post('/upload', async (req: Request, res: Response) => {
    try {
      handleUpload(req, res);
    } catch (e) {
      respondWithError(e, res);
    }
  });

  route.delete('/:id', async (req: Request, res: Response) => {
    try {
      const success = await deletePost(req.params, res.locals.user);
      return res.status(200).json({ success });
    } catch (e) {
      respondWithError(e, res);
    }
  });
};
