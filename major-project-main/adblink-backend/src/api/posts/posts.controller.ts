import database from '../../loaders/database';
import { ICreatePost, YFindPost, IPost, YCreatePost, IFindPost, IDeletePost, YDeletePost } from './posts.types';
import { APIError, respondWithError } from '../../utils/error';
import { IUser } from '../users/users.types';
import { ObjectID } from 'bson';
import Busboy from 'busboy';
import s3 from '../../loaders/storage';
import config from '../../config';
import { nanoid } from 'nanoid';
import mime from 'mime-types';
import { Request, Response } from 'express';
import axios from 'axios';

export const POSTS_COLLECTION = 'posts';

const fetchPosts = async (user: IUser) => {
  const db = await database();
  const posts = await db.collection(POSTS_COLLECTION).find({ owner: user.email }).toArray();

  if (posts.length === 0) {
    throw new APIError(404, 'No posts...');
  }

  return posts as IPost[];
};

const fetchPost = async (payload: any, user: IUser) => {
  // Validate body...
  if (!(await YFindPost.isValid(payload))) {
    throw new APIError(422, 'Validation failed...');
  }

  const body = payload as IFindPost;

  let _id;
  try {
    _id = new ObjectID(body.id);
  } catch (e) {
    throw new APIError(404, 'Post not found...');
  }

  const db = await database();
  const post = await db.collection(POSTS_COLLECTION).findOne({ _id, owner: user.email });

  if (!post) {
    throw new APIError(404, 'Post not found...');
  }

  return post;
};

const deletePost = async (payload: any, user: IUser) => {
  // Validate body...
  if (!(await YDeletePost.isValid(payload))) {
    throw new APIError(422, 'Validation failed...');
  }

  const body = payload as IDeletePost;

  let _id;
  try {
    _id = new ObjectID(body.id);
  } catch (e) {
    throw new APIError(404, 'Post not found...');
  }

  const db = await database();
  const post = await db.collection(POSTS_COLLECTION).deleteOne({ _id, owner: user.email });
  return post.deletedCount === 1;
};

const findPostWithCategory = async (category: string) => {
  const db = await database();
  const posts = await db.collection(POSTS_COLLECTION).find({ tags: category }).toArray();
  return posts[Math.floor(Math.random() * posts.length)];
};

const createPost = async (payload: any, user: IUser) => {
  // Validate body...
  if (!(await YCreatePost.isValid(payload))) {
    throw new APIError(422, 'Validation failed...');
  }

  const body = payload as ICreatePost;

  await axios.post('http://127.0.0.1:5000/add_data', {
    ad_category: body.tags.join(' '),
    ad_advertiser: body.title,
    ad_product: body.title,
    ad_description: body.description,
  });

  const db = await database();

  const candidatePost = {
    ...body,
    created_at: new Date().toISOString(),
    owner: user.email,
  };

  await db.collection(POSTS_COLLECTION).insertOne(candidatePost);
  return candidatePost;
};

const handleUpload = (req: Request, res: Response) => {
  const busboy = new Busboy({ headers: req.headers });
  const id = nanoid();

  busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
    const bufs = [];
    file.on('data', function (data) {
      bufs.push(data);
    });
    file.on('end', function () {
      const buf = Buffer.concat(bufs);
      const key = `${id}.${mime.extension(mimetype)}`;

      if (buf.length === 0) {
        return res.status(422).json({ success: false, message: 'Validation failed...' });
      }

      s3.upload({ Bucket: config.aws.s3Bucket, Key: key, Body: buf }, function (err, data) {
        if (err) {
          throw err;
        }
        console.log(data.Location);
        return res.status(201).json({ success: true, file_name: key });
      });
    });
  });

  return req.pipe(busboy);
};

export { fetchPosts, fetchPost, findPostWithCategory, deletePost, createPost, handleUpload };
