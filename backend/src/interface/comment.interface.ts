import mongoose from "mongoose";
export interface IComment {
  _id: mongoose.Types.ObjectId;
  content: string;
  author: string;
  createdAt: Date;
  replies: IComment[];
}
