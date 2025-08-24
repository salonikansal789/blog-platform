import  { Document } from "mongoose";
import { IComment } from "./comment.interface";

export interface IPost extends Document {
  title: string;
  content: string;
  summary: string;
  tags: string[];
  likes: number;
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}
