import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { blogAPI } from "../services/api";
import { toast } from "react-toastify";

const AddPost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    summary: "",
    tags: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.summary) newErrors.summary = "Summary is required";
    if (!formData.content) newErrors.content = "Content is required";

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    try {
      setLoading(true);
      setError({});

      const postData = {
        ...formData,
        tags: formData.tags
          ? formData.tags.split(",").map((tag) => tag.trim().toLowerCase())
          : [],
      };

      await blogAPI.createPost(postData);
      navigate("/");
      toast.success("Post created successfully!");
    } catch (err) {
      setError("Failed to create post");
      console.error(err);
      toast.error("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      content: "",
      summary: "",
      tags: "",
    });
    navigate("/");
  };

  return (
    <div className="add-post">
      <h2>Add New Post</h2>

      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            maxLength={200}
          />
          {error.title && <p className="error-text">{error.title}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="summary">Summary *</label>
          <textarea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            maxLength={500}
            rows={3}
            placeholder="Brief summary of your post..."
          />
          {error.summary && <p className="error-text">{error.summary}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="content">Content *</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={10}
            placeholder="Write your post content here..."
          />
          {error.content && <p className="error-text">{error.content}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="javascript, react, tutorial (comma separated)"
          />
          {error.tags && <p className="error-text">{error.tags}</p>}
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={handleCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Creating..." : "Create Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPost;
