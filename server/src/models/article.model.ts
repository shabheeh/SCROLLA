import { model, Schema } from "mongoose";
import { IArticle } from "../interfaces/article.interface";

const articleSchema = new Schema<IArticle>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    featureImage: {
      type: String,
      optional: true,
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    categories: {
      type: [Schema.Types.ObjectId],
      ref: "Preference",
      default: [],
    },
    topics: {
      type: [String],
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      required: true,
    },
    isPublished: {
      type: Boolean,
      required: true,
    },
    readTime: {
      type: String,
      required: true,
    },
    likedBy: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    dislikedBy: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    blockedBy: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const ArticleModel = model<IArticle>("Article", articleSchema);
