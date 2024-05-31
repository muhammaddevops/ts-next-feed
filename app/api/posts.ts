import { Post } from "../interfaces/Post";
import { PostComment } from "../interfaces/PostComment";
import { api } from "./apiClient";

export const getPosts = async ({ page = 1, limit = 10 }) => {
  try {
    const res = await api.get<Post[]>("/posts", { params: { page, limit } });
    return res.data;
  } catch (error) {
    console.error("Error getting post", error);
    throw error;
  }
};

export const getPostComments = async (id: number) => {
  try {
    const res = await api.get<PostComment[]>(`/posts/${id}/comments`);
    return res.data;
  } catch (error) {
    console.error("Error getting post", error);
    throw error;
  }
};
