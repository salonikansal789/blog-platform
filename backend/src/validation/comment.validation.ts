import Joi from "joi";

export const commentSchema = Joi.object({
  content: Joi.string().trim().min(1).max(1000).required().messages({
    "string.empty": "Comment content is required",
    "string.max": "Comment must not exceed 1000 characters",
  }),

  author: Joi.string().trim().min(1).max(100).required().messages({
    "string.empty": "Author name is required",
    "string.max": "Author name must not exceed 100 characters",
  }),
});


