import ResponseService from "./response.service";

import { IPost } from "../interface/post.interface";
import { IComment } from "../interface/comment.interface";
import Post from "../models/posts";
import mongoose from "mongoose";

class PostService extends ResponseService {
  async getAllPosts(queryParams: any) {
    const { page, limit, tags, search, sort } = queryParams;
    const skip = (page - 1) * limit;

    let query: any = {};

    if (tags) {
      const tagArray = tags
        .split(",")
        .map((tag: string) => tag.trim().toLowerCase());
      query.tags = { $in: tagArray };
    }

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const posts = await Post.find(query)
      .select("title summary tags likes createdAt updatedAt")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Post.countDocuments(query);

    if (posts.length === 0) {
      return this.serviceResponse(
        404,
        {},
        "No posts found matching the criteria"
      );
    }

    return this.serviceResponse(
      200,
      {
        posts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalPosts: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
      },
      "Posts fetched successfully"
    );
  }

  async getPostById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return this.serviceResponse(400, {}, "Invalid post ID ");

    const post = await Post.findById(id).lean();

    if (!post) {
      return this.serviceResponse(404, {}, "Post not found");
    }
    return this.serviceResponse(200, { post }, "Post fetched successfully");
  }

  async createPost(data: IPost) {
    const newPost = new Post(data);

    await newPost.save();
    return this.serviceResponse(
      201,
      { post: newPost },
      "Post created successfully"
    );
  }

  async updatePost(id: string, data: Partial<IPost>) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return this.serviceResponse(400, {}, "Invalid post ID format");
    const post = await Post.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean();
    if (!post) {
      return this.serviceResponse(404, {}, "Post not found");
    }
    return this.serviceResponse(200, { post }, "Post updated successfully");
  }

  async deletePost(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return this.serviceResponse(400, {}, "Invalid post ID");
    await Post.findByIdAndDelete(id);
    return this.serviceResponse(200, {}, "Post deleted successfully");
  }

  async likePost(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return this.serviceResponse(400, {}, "Invalid post ID");
    const post = await Post.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    )
      .select("likes")
      .lean();
    if (!post) {
      return this.serviceResponse(404, {}, "Post not found");
    }
    return this.serviceResponse(
      200,
      { likes: post.likes },
      "Post liked successfully"
    );
  }

  async addComment(id: string, comment: IComment, parentCommentId?: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return this.serviceResponse(400, {}, "Invalid post ID format");

    let post;

    if (parentCommentId && mongoose.Types.ObjectId.isValid(parentCommentId)) {
      post = await Post.findOneAndUpdate(
        { _id: id, "comments._id": parentCommentId },
        { $push: { "comments.$.replies": comment } },
        { new: true }
      ).lean();
      if (!post) {
        return this.serviceResponse(
          404,
          {},
          "Post or parent comment not found"
        );
      }
    } else {
      post = await Post.findByIdAndUpdate(
        id,
        { $push: { comments: comment } },
        { new: true }
      ).lean();
      if (!post) {
        return this.serviceResponse(404, {}, "Post not found");
      }
    }
    return this.serviceResponse(200, { post }, "Comment added successfully");
  }

  async getTags() {
    const tags = await Post.aggregate([
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 50 },
    ]);

    const tag = tags.map((tag) => ({ name: tag._id, count: tag.count }));
    return this.serviceResponse(
      200,
      { tags: tag },
      "Tags fetched successfully"
    );
  }
}

export const postService = new PostService();
