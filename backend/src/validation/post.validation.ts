import Joi from "joi";

export const createPostSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required().messages({
    "string.empty": "Title is required",
    "string.max": "Title must not exceed 200 characters",
  }),

  content: Joi.string().trim().min(1).required().messages({
    "string.empty": "Content is required",
  }),

  summary: Joi.string().trim().min(1).max(500).required().messages({
    "string.empty": "Summary is required",
    "string.max": "Summary must not exceed 500 characters",
  }),

  tags: Joi.array().items(Joi.string().trim().lowercase()).default([]),
});

export const updatePostSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).messages({
    "string.empty": "Title cannot be empty",
    "string.max": "Title must not exceed 200 characters",
  }),

  content: Joi.string().trim().min(1).messages({
    "string.empty": "Content cannot be empty",
  }),

  summary: Joi.string().trim().min(1).max(500).messages({
    "string.empty": "Summary cannot be empty",
    "string.max": "Summary must not exceed 500 characters",
  }),

  tags: Joi.array().items(Joi.string().trim().lowercase()),
}).min(1);
export const querySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  tags: Joi.string().trim(),
  search: Joi.string().trim(),
  sort: Joi.string()
    .valid("createdAt", "-createdAt", "likes", "-likes", "title", "-title")
    .default("-createdAt"),
});
