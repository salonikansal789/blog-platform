import axios from "axios";

const API_URL = "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const blogAPI = {
  // Posts
  getPosts: (params = {}) => api.get("/posts", { params }),
  getPost: (id) => api.get(`/posts/${id}`),
  createPost: (data) => api.post("/posts", data),
  updatePost: (id, data) => api.put(`/posts/${id}`, data),
  deletePost: (id) => api.delete(`/posts/${id}`),
  likePost: (id) => api.post(`/posts/${id}/like`),

  // Comments
  addComment: (postId, data, parentId) => {
    const url = parentId
      ? `/posts/${postId}/comments?parentCommentId=${parentId}`
      : `/posts/${postId}/comments`;
    return api.post(url, data);
  },

  // Tags
  getTags: () => api.get("/posts/tags"),
};
