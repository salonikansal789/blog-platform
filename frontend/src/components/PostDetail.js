import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { blogAPI } from "../services/api";
import CommentSection from "./CommentSection";
import { toast } from "react-toastify";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    content: "",
    summary: "",
    tags: "",
  });

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await blogAPI.getPost(id);
      setPost(response.data.data.post);
    } catch (err) {
      setError(err?.response?.data?.message);
      // toast.error(err?.response?.data?.message );
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      await blogAPI.likePost(id);
      setPost((prev) => ({ ...prev, likes: prev.likes + 1 }));
      toast.success("Post liked!");
    } catch (err) {
      console.error("Failed to like post:", err);
      toast.error("Failed to like post");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({
      title: post.title,
      content: post.content,
      summary: post.summary,
      tags: Array.isArray(post.tags) ? post.tags.join(" ") : post.tags || "",
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const tagsArray = editForm.tags
        .split(/[\s,]+/) // split by comma or space
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean);

      const response = await blogAPI.updatePost(id, {
        ...editForm,
        tags: tagsArray,
      });
      setPost(response.data.data.post);
      setIsEditing(false);
      toast.success("Post updated successfully!");
    } catch (err) {
      console.error("Failed to update post:", err);
      toast.error("Failed to update post");
    }
  };

  if (loading) return <div className="loading">Loading post...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!post) return <div className="error">Post not found</div>;

  return (
    <div className="post-detail">
      <Link to="/" className="back-link">
        ← Back to Posts
      </Link>

      {isEditing ? (
        <div className="add-post">
          <form onSubmit={handleSave} className="post-form">
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="summary">Summary *</label>
              <textarea
                type="text"
                value={editForm.summary}
                onChange={(e) =>
                  setEditForm({ ...editForm, summary: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="content">Content *</label>
              <textarea
                value={editForm.content}
                onChange={(e) =>
                  setEditForm({ ...editForm, content: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags</label>
              <input
                type="text"
                value={editForm.tags}
                onChange={(e) =>
                  setEditForm({ ...editForm, tags: e.target.value })
                }
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? "Editing..." : "Edit Post"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <article className="post">
            <header className="post-header">
              <h1>{post.title}</h1>
              <p className="post-summary">{post.summary}</p>{" "}
              <div className="post-meta">
                <div className="tags-container">
                  {post.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag.charAt(0).toUpperCase() + tag.slice(1)}
                    </span>
                  ))}
                </div>
                <div className="post-stats">
                  <span>{`${post.comments?.length || 0} Comments`}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="post-stats">
                  <button onClick={handleLike} className="btn-primary">
                    {`${post.likes} Likes`}
                  </button>
                  <button onClick={handleEdit} className="btn-primary">
                    Edit
                  </button>
                </div>
              </div>
            </header>

            <div className="post-content">
              {post.content.split("\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </article>

          <CommentSection
            postId={id}
            comments={post.comments || []}
            onCommentAdded={fetchPost}
          />
        </>
      )}
    </div>
  );
};

export default PostDetail;
