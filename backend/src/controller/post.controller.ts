import { Request, Response } from "express";
import { IPost } from "../interface/post.interface";
import { IComment } from "../interface/comment.interface";
import Post from "../models/posts";
import {
  createPostSchema,
  updatePostSchema,
  querySchema,
} from "../validation/post.validation";
import { commentSchema } from "../validation/comment.validation";
import mongoose from "mongoose";

export class PostController {
  public async getAllPosts(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = querySchema.validate(req.query);

      if (error) {
        res.status(400).json({
          success: false,
          message: "Invalid query parameters",
          errors: error.details.map((detail) => detail.message),
        });
        return;
      }

      const { page, limit, tags, search, sort } = value;
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

      res.status(200).json({
        success: true,
        data: {
          posts,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalPosts: total,
            hasNextPage: page < Math.ceil(total / limit),
            hasPrevPage: page > 1,
          },
        },
      });
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error while fetching posts",
      });
    }
  }

  public async getPostById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          message: "Invalid post ID format",
        });
        return;
      }

      const post = await Post.findById(id).lean();

      if (!post) {
        res.status(404).json({
          success: false,
          message: "Post not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: { post },
      });
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error while fetching post",
      });
    }
  }

  public async createPost(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = createPostSchema.validate(req.body);

      if (error) {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.details.map((detail) => detail.message),
        });
        return;
      }

      const newPost = new Post(value);
      const savedPost = await newPost.save();

      res.status(201).json({
        success: true,
        message: "Post created successfully",
        data: { post: savedPost },
      });
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error while creating post",
      });
    }
  }

  public async updatePost(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          message: "Invalid post ID format",
        });
        return;
      }

      const { error, value } = updatePostSchema.validate(req.body);

      if (error) {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.details.map((detail) => detail.message),
        });
        return;
      }

      const updatedPost = await Post.findByIdAndUpdate(
        id,
        { ...value, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).lean();

      if (!updatedPost) {
        res.status(404).json({
          success: false,
          message: "Post not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Post updated successfully",
        data: { post: updatedPost },
      });
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error while updating post",
      });
    }
  }

  public async deletePost(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          message: "Invalid post ID format",
        });
        return;
      }

      const deletedPost = await Post.findByIdAndDelete(id);

      if (!deletedPost) {
        res.status(404).json({
          success: false,
          message: "Post not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Post deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error while deleting post",
      });
    }
  }

  public async likePost(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          message: "Invalid post ID format",
        });
        return;
      }

      const post = await Post.findByIdAndUpdate(
        id,
        { $inc: { likes: 1 } },
        { new: true }
      )
        .select("likes")
        .lean();

      if (!post) {
        res.status(404).json({
          success: false,
          message: "Post not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Post liked successfully",
        data: { likes: post.likes },
      });
    } catch (error) {
      console.error("Error liking post:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error while liking post",
      });
    }
  }

  public async addComment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { parentCommentId } = req.query;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          message: "Invalid post ID format",
        });
        return;
      }

      const { error, value } = commentSchema.validate(req.body);

      if (error) {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.details.map((detail) => detail.message),
        });
        return;
      }

      const newComment: IComment = {
        _id: new mongoose.Types.ObjectId(),
        content: value.content,
        author: value.author,
        createdAt: new Date(),
        replies: [],
      };

      let post;

      if (
        parentCommentId &&
        mongoose.Types.ObjectId.isValid(parentCommentId as string)
      ) {
        post = await Post.findOneAndUpdate(
          { _id: id, "comments._id": parentCommentId },
          { $push: { "comments.$.replies": newComment } },
          { new: true }
        ).lean();
      } else {
        post = await Post.findByIdAndUpdate(
          id,
          { $push: { comments: newComment } },
          { new: true }
        ).lean();
      }

      if (!post) {
        res.status(404).json({
          success: false,
          message: parentCommentId
            ? "Post or parent comment not found"
            : "Post not found",
        });
        return;
      }

      res.status(201).json({
        success: true,
        message: "Comment added successfully",
        data: { comment: newComment },
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error while adding comment",
      });
    }
  }

  public async getTags(req: Request, res: Response): Promise<void> {
    try {
      const tags = await Post.aggregate([
        { $unwind: "$tags" },
        { $group: { _id: "$tags", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 50 },
      ]);

      res.status(200).json({
        success: true,
        data: {
          tags: tags.map((tag) => ({ name: tag._id, count: tag.count })),
        },
      });
    } catch (error) {
      console.error("Error fetching tags:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error while fetching tags",
      });
    }
  }
}
