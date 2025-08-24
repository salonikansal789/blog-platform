import mongoose, { Document, Schema } from "mongoose";
import { IPost } from "../interface/post.interface";
import { IComment } from "../interface/comment.interface";

const CommentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    author: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    replies: [
      {
        type: Schema.Types.Mixed,
        default: [],
      },
    ],
  },
  { _id: true }
);


const PostSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    comments: [CommentSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

PostSchema.index({
  title: "text",
  content: "text",
  summary: "text",
  tags: "text",
});

PostSchema.index({ tags: 1 });

PostSchema.index({ createdAt: -1 });

export default mongoose.model<IPost>("Post", PostSchema);
