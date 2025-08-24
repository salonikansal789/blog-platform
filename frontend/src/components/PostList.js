import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { blogAPI } from "../services/api";
const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [tags, setTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPosts();
    fetchTags();
  }, [currentPage, appliedSearch]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 5,
        ...(search && { search: appliedSearch }),
        ...(selectedTags.length && { tags: selectedTags.join(",") }),
      };
      const response = await blogAPI.getPosts(params);
      setPosts(response.data.data.posts);
      setTotalPages(response.data.data.pagination.totalPages);
    } catch (err) {
      setError("Failed to fetch posts");
      console.error(err);
      toast.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await blogAPI.getTags();
      setTags(response.data.data.tags || []);
    } catch (err) {
      console.error("Failed to fetch tags:", err);
      toast.error("Failed to fetch tags");
    }
  };

  const handleSearch = () => {
    setAppliedSearch(search);
    setCurrentPage(1);
  };

  const handleCancelSearch = () => {
    setSearch("");
    setAppliedSearch("");
    setCurrentPage(1);
  };

  const handleSearchType = (e) => {
    setSearch(e.target.value);
  };

  const toggleTag = (tagName) => {
    if (tagName === "All") {
      setSelectedTags([]);
      fetchPosts();
    } else {
      setSelectedTags((prev) =>
        prev.includes(tagName)
          ? prev.filter((t) => t !== tagName)
          : [...prev, tagName]
      );
      fetchPosts();
    }
    setCurrentPage(1);
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await blogAPI.deletePost(postId);
      toast.success("Post deleted successfully!");
      fetchPosts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete post");
    }
  };

  return (
    <div className="post-list">
      <h2>All Posts</h2>

      {/* Search */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={handleSearchType}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          className="search-input"
        />
        <button onClick={handleCancelSearch} className="btn-secondary">
          Clear
        </button>
        <button onClick={handleSearch} className="btn-primary">
          Search
        </button>
      </div>

      {/* Tags Filter */}
      <div className="tags-filter">
        <h3>Filter By Tags:</h3>
        <div className="tags-container">
          <button
            onClick={() => toggleTag("All")}
            className={`tag ${selectedTags.length === 0 ? "selected" : ""}`}
          >
            All
          </button>

          {tags.map((tag) => (
            <button
              key={tag.name}
              onClick={() => toggleTag(tag.name)}
              className={`tag ${
                selectedTags.includes(tag.name) ? "selected" : ""
              }`}
            >
              {tag.name.charAt(0).toUpperCase() + tag.name.slice(1)}({tag.count}
              )
            </button>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="posts-container">
        {loading ? (
          <div className="loading">Loading posts...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : posts.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="post-card">
              <h3>
                <Link to={`/post/${post._id}`}>{post.title}</Link>
              </h3>
              <hr />
              <br />
              <p className="post-summary">{post.summary}</p>
              <div className="post-meta">
                <div className="post-tags">
                  {post.tags.map((tag) => (
                    <span key={tag} className="tag small">
                      {tag.charAt(0).toUpperCase() + tag.slice(1)}
                    </span>
                  ))}
                </div>
                <div className="post-stats">
                  <span> {`${post.likes} Likes`}</span>
                  <span>{`${post.comments?.length || 0} Comments`}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  <i
                    className="fas fa-trash"
                    style={{
                      color: "red",
                      cursor: "pointer",
                      fontSize: "18px",
                      marginLeft: "10px",
                    }}
                    onClick={() => handleDelete(post._id)}
                    title="Delete Post"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="btn-primary"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="btn-primary"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PostList;
