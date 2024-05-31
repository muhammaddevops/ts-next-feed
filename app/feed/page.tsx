"use client";
import { useState, useEffect } from "react";
import { Post } from "../interfaces/Post";
import { PostComment } from "../interfaces/PostComment";
import { getPosts, getPostComments } from "../api/posts";
import { AxiosError } from "axios";
import { Box, Button, Grid, Paper, Typography, styled } from "@mui/material";

export const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

interface PostWithComments extends Post {
  comments?: PostComment[];
}

const Feed = () => {
  const [posts, setPosts] = useState<PostWithComments[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    getPosts({ page: currentPage + 1, limit: postsPerPage })
      .then(async (posts) => {
        const postsWithComments: PostWithComments[] = await Promise.all(
          posts.map(async (post): Promise<PostWithComments> => {
            try {
              const comments = await getPostComments(post.id);
              return { ...post, comments };
            } catch (error) {
              console.error("Error getting comments for post", post.id, error);
              return { ...post, comments: [] };
            }
          })
        );
        setPosts(postsWithComments);
        setIsLoading(false);
      })
      .catch((error: AxiosError) => {
        setError(`Failed to load posts: ${error.message}`);
        setIsLoading(false);
      });
  }, [currentPage, postsPerPage]);

  const handleToggleComments = (postId: number) => {
    setSelectedPostId(selectedPostId === postId ? null : postId);
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Grid container spacing={2}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            <Item>
              <Typography variant="h6">{post.title}</Typography>
              <Typography variant="body2" color="textSecondary" mb={2}>
                {post.body}
              </Typography>
              {post.comments && post.comments.length > 0 && (
                <Button
                  variant="outlined"
                  onClick={() => handleToggleComments(post.id)}
                >
                  Comments: {post.comments.length}
                </Button>
              )}
              {selectedPostId === post.id && post.comments && (
                <div>
                  {post.comments.map((comment) => (
                    <Typography key={comment.id} variant="h6" mt={2}>
                      {comment.name}:
                      <Typography variant="body2" color="textSecondary">
                        {comment.body}
                      </Typography>
                      <Typography variant="body2" color="textPrimary">
                        By: {comment.name}
                      </Typography>
                    </Typography>
                  ))}
                </div>
              )}
            </Item>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Feed;
