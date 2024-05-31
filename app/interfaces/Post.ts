import { PostComment } from "./PostComment";

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
  comments?: PostComment[];
}
