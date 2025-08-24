import React, { useState } from "react";
import { blogAPI } from "../services/api";
const Comment = ({ comment, postId, onCommentAdded, level = 0 }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyData, setReplyData] = useState({ content: "", author: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyData.content || !replyData.author) return;

    const newErrors = {};
    if (!replyData.content) newErrors.name = "Name is required";
    if (!replyData.author) newErrors.reply = "Comment is required";

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    try {
      setLoading(true);
      setError({});
      await blogAPI.addComment(postId, replyData, comment._id);
      setReplyData({ content: "", author: "" });
      setShowReplyForm(false);
      onCommentAdded();
    } catch (err) {
      console.error("Failed to add reply:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`comment ${level > 0 ? "reply" : ""}`}
      style={{ marginLeft: level * 20 }}
    >
      <div className="comment-header">
        <strong>{comment.author}</strong>
        <span className="comment-date">
          {new Date(comment.createdAt).toLocaleString()}
        </span>
      </div>
      <div className="comment-content">{comment.content}</div>
      <div className="comment-actions">
        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="reply-btn"
        >
          Reply
        </button>
      </div>

      {showReplyForm && (
        <form onSubmit={handleReply} className="reply-form">
          <input
            type="text"
            placeholder="Your name"
            value={replyData.author}
            onChange={(e) =>
              setReplyData({ ...replyData, author: e.target.value })
            }
          />
          {error.name && <p className="error-text">{error.name}</p>}
          <textarea
            placeholder="Write your reply..."
            value={replyData.content}
            onChange={(e) =>
              setReplyData({ ...replyData, content: e.target.value })
            }
          />
          {error.reply && <p className="error-text">{error.reply}</p>}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => setShowReplyForm(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Posting..." : "Post Reply"}
            </button>
          </div>
        </form>
      )}

      {comment.replies &&
        comment.replies.map((reply) => (
          <Comment
            key={reply._id}
            comment={reply}
            postId={postId}
            onCommentAdded={onCommentAdded}
            level={level + 1}
          />
        ))}
    </div>
  );
};

const CommentSection = ({ postId, comments, onCommentAdded }) => {
  const [commentData, setCommentData] = useState({ content: "", author: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!commentData.content) newErrors.name = "Name is required";
    if (!commentData.author) newErrors.reply = "Comment is required";

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    try {
      setLoading(true);
      setError({});
      await blogAPI.addComment(postId, commentData);
      setCommentData({ content: "", author: "" });
      onCommentAdded();
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comment-section">
      <h3>Comments ({comments.length})</h3>

      <form onSubmit={handleSubmit} className="comment-form">
        <h4>Add a Comment</h4>
        <input
          type="text"
          placeholder="Your name"
          value={commentData.author}
          onChange={(e) =>
            setCommentData({ ...commentData, author: e.target.value })
          }
        />
        {error.name && <p className="error-text">{error.name}</p>}

        <textarea
          placeholder="Write your comment..."
          value={commentData.content}
          onChange={(e) =>
            setCommentData({ ...commentData, content: e.target.value })
          }
          rows={4}
        />
        {error.reply && <p className="error-text">{error.reply}</p>}

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </form>

      <div className="comments-list">
        {comments.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            postId={postId}
            onCommentAdded={onCommentAdded}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
