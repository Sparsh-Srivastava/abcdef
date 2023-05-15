import { ObjectID } from 'bson';
import * as yup from 'yup';
import { TypeOf } from 'yup';

type UserEmail = string;

export interface IPost {
  _id?: ObjectID;
  title: string;
  description: string;
  tags: string[];
  created_at: string;
  file_name: string;
  redirect_url?: string;
  owner: UserEmail;
}

const YSinglePost = yup
  .object()
  .shape({
    id: yup.string().required(),
  })
  .required();

export const YFindPost = YSinglePost;
export const YDeletePost = YSinglePost;

export const YCreatePost = yup
  .object()
  .shape({
    title: yup.string().required(),
    description: yup.string().required(),
    tags: yup.array(yup.string()).required(),
    redirect_url: yup.string(),
    file_name: yup.string().required(),
  })
  .required();

export interface IFindPost extends TypeOf<typeof YFindPost> {}
export interface ICreatePost extends TypeOf<typeof YCreatePost> {}
export interface IDeletePost extends TypeOf<typeof YCreatePost> {}
