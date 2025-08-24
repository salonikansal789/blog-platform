import { NextFunction, Request, Response } from "express";
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
import ResponseService from "../service/response.service";
import { postService } from "../service/post.service";

export class PostController extends ResponseService {
  private readonly postService = postService;

  public getAllPosts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { error, value } = querySchema.validate(req.query);

      if (error) {
        this.sendResponse(res, 400, undefined, "Invalid query parameters");
      }

      const { data, message, statusCode } =
        await this.postService.getAllPosts(value);

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      this.sendResponse(
        res,
        500,
        undefined,
        "Internal server error while fetching posts"
      );
    }
  };

  public getPostById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      const { data, message, statusCode } =
        await this.postService.getPostById(id);

      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      this.sendResponse(res, 500, undefined, "Internal server error");
    }
  };

  public createPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { error, value } = createPostSchema.validate(req.body);

      if (error) {
        this.sendResponse(res, 400, undefined, "Invalid body parameters");
      }

      const { data, message, statusCode } =
        await this.postService.createPost(value);
      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      this.sendResponse(res, 500, undefined, "Internal server error");
    }
  };

  public updatePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      const { error, value } = updatePostSchema.validate(req.body);

      if (error) {
        this.sendResponse(res, 400, undefined, "Invalid body parameters");
      }

      const { data, message, statusCode } = await this.postService.updatePost(
        id,
        value
      );
      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      this.sendResponse(res, 500, undefined, "Internal server error");
    }
  };

  public deletePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        this.sendResponse(res, 400, undefined, "Invalid params parameters");
      }

      const { data, message, statusCode } =
        await this.postService.deletePost(id);
      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      this.sendResponse(res, 500, undefined, "Internal server error");
    }
  };
  public likePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        this.sendResponse(res, 400, undefined, "Invalid params parameters");
      }

      const { data, message, statusCode } = await this.postService.likePost(id);
      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      this.sendResponse(res, 500, undefined, "Internal server error");
    }
  };

  public addComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { parentCommentId } = req.query;

      const { error, value } = commentSchema.validate(req.body);

      if (error) {
        this.sendResponse(res, 400, undefined, "Invalid body parameters");
      }
      const { data, message, statusCode } = await this.postService.addComment(
        id,
        value as IComment,
        parentCommentId as string
      );
      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      this.sendResponse(res, 500, undefined, "Internal server error");
    }
  };

  public getTags = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { data, message, statusCode } = await this.postService.getTags();
      this.sendResponse(res, statusCode, data, message);
    } catch (error) {
      this.sendResponse(res, 500, undefined, "Internal server error");
    }
  };
}
