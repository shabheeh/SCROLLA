import { Document, Types } from "mongoose";

export interface IArticle extends Document {
  author: Types.ObjectId;
  featureImage: string;
  title: string;
  subtitle: string;
  content: string;
  categories: Types.ObjectId[];
  topics: string[];
  visibility: "public" | "private";
  isPublished: boolean;
  readTime: string;
  likedBy: Types.ObjectId[];
  dislikedBy: Types.ObjectId[];
  blockedBy: Types.ObjectId[];
}
