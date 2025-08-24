import { Router } from "express";

import { PostController } from "../controller/post.controller";
const router = Router();
const postController = new PostController();

router.get("/", postController.getAllPosts);

router.get("/tags", postController.getTags);

router.get("/:id", postController.getPostById);

router.post("/", postController.createPost);

router.put("/:id", postController.updatePost);

router.delete("/:id", postController.deletePost);

router.post("/:id/like", postController.likePost);

router.post("/:id/comments", postController.addComment);

export default router;
