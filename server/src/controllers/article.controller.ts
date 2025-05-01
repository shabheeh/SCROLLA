import { Request, Response } from "express";
import { PreferenceModel } from "../models/preference.model";
import { HttpStatusCode } from "../constants/httpStatusCodes";
import { ResponseMessage } from "../constants/responseMessages";
import { CustomRequest } from "src/middlewares/authMiddleware";
import { ArticleModel } from "../models/article.model";
import CustomError from "../utils/error";
import { userModel } from "../models/user.model";
import { Types, isValidObjectId } from "mongoose";

export const getArticlePrefernces = async (
  _req: Request,
  res: Response
): Promise<void> => {
  const preferences = await PreferenceModel.find();

  res.status(HttpStatusCode.OK).json({
    success: true,
    message: ResponseMessage.SUCCESS.OPERATION_SUCCESSFUL,
    preferences,
  });
};

export const addArticle = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const articleData = req.body;

  const userId = req.userId;

  articleData.author = userId;

  const article = await ArticleModel.create(articleData);

  if (!article) {
    throw new CustomError(
      "Failed to post article",
      HttpStatusCode.INTERNAL_SERVER_ERROR
    );
  }

  res.status(HttpStatusCode.CREATED).json({
    success: true,
    message: ResponseMessage.SUCCESS.RESOURCE_CREATED,
    article,
  });
};

export const getArticles = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const userId = req.userId;

  const user = await userModel.findById(userId).lean();

  if (!user) {
    throw new CustomError("User not found", HttpStatusCode.NOT_FOUND);
  }

  const searchQuery = req.query.searchQuery as string | undefined;
  const preferenceQuery = req.query.preference as string | undefined;

  const matchStage: {
    visibility: "public" | "private";
    isPublished: boolean;
    $or?: Array<
      | { title: { $regex: RegExp } }
      | { topics: { $elemMatch: { $regex: RegExp } } }
    >;
    categories?: { $in: Types.ObjectId[] };
  } = {
    visibility: "public",
    isPublished: true,
  };

  if (searchQuery) {
    const regex = new RegExp(searchQuery, "i");
    matchStage.$or = [
      { title: { $regex: regex } },
      { topics: { $elemMatch: { $regex: regex } } },
    ];
  } else if (preferenceQuery && isValidObjectId(preferenceQuery)) {
    matchStage.categories = { $in: [new Types.ObjectId(preferenceQuery)] };
  } else if (user.preferences.length > 0) {
    matchStage.categories = {
      $in: user.preferences.map((pref) => new Types.ObjectId(pref)),
    };
  }

  const articles = await ArticleModel.aggregate([
    { $match: matchStage },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $unwind: "$author",
    },
    {
      $project: {
        title: 1,
        subtitle: 1,
        featureImage: 1,
        categories: 1,
        topics: 1,
        visibility: 1,
        isPublished: 1,
        likedBy: 1,
        dislikedBy: 1,
        blockedBy: 1,
        createdAt: 1,
        updatedAt: 1,
        readTime: 1,
        "author._id": 1,
        "author.firstName": 1,
        "author.lastName": 1,
        "author.profilePicture": 1,
      },
    },
  ]);

  res.status(HttpStatusCode.OK).json({
    success: true,
    message: ResponseMessage.SUCCESS.OPERATION_SUCCESSFUL,
    articles,
  });
};

export const getTrendingTopics = async (
  _req: Request,
  res: Response
): Promise<void> => {
  const trendingArticles = await ArticleModel.aggregate([
    {
      $addFields: {
        likesCount: { $size: "$likedBy" },
      },
    },
    {
      $sort: { likesCount: -1 },
    },
    {
      $limit: 10,
    },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $unwind: "$author",
    },
    {
      $project: {
        _id: 1,
        title: 1,
        subtitle: 1,
        topics: 1,
        createdAt: 1,
        likesCount: 1,
        "author._id": 1,
        "author.firstName": 1,
        "author.lastName": 1,
        "author.profilePicture": 1,
      },
    },
  ]);

  res.status(200).json({
    success: true,
    message: ResponseMessage.SUCCESS.OPERATION_SUCCESSFUL,
    trendingArticles,
  });
};

export const getArticle = async (
  req: Request,
  res: Response
): Promise<void> => {
  const articleId = req.params.articleId;

  const article = await ArticleModel.findOne({
    _id: articleId,
    isPublished: true,
    visibility: "public",
  })
    .populate("author", "-password")
    .exec();

  if (!article) {
    throw new CustomError("Article not found", HttpStatusCode.NOT_FOUND);
  }

  res.status(HttpStatusCode.OK).json({
    success: true,
    message: ResponseMessage.SUCCESS.OPERATION_SUCCESSFUL,
    article,
  });
};

export const getUserArticles = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const authorId = req.params.userId;
  const userId = req.userId;

  let articles = [];

  if (authorId === userId) {
    articles = await ArticleModel.find({
      author: userId,
    }).populate("author", "_id");
  } else {
    articles = await ArticleModel.find({
      author: authorId,
      isPublished: true,
      visibility: "public",
    }).populate("author", "_id");
  }

  res.status(HttpStatusCode.OK).json({
    success: true,
    message: ResponseMessage.SUCCESS.OPERATION_SUCCESSFUL,
    articles,
  });
};

export const likeArticle = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { articleId } = req.params;
  const userId = req.userId;

  const article = await ArticleModel.findById(articleId);

  if (!article) {
    throw new CustomError("Article not found", HttpStatusCode.NOT_FOUND);
  }

  const updatedArticle = await ArticleModel.findByIdAndUpdate(
    articleId,
    {
      $addToSet: { likedBy: userId },
      $pull: { dislikedBy: userId },
    },
    { new: true }
  )
    .populate("author")
    .exec();

  res.status(HttpStatusCode.OK).json({
    success: true,
    message: ResponseMessage.SUCCESS.RESOURCE_UPDATED,
    article: updatedArticle,
  });
};

export const dislikeArticle = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { articleId } = req.params;
  const userId = req.userId;

  const article = await ArticleModel.findById(articleId);

  if (!article) {
    throw new CustomError("Article not found", HttpStatusCode.NOT_FOUND);
  }

  const updatedArticle = await ArticleModel.findByIdAndUpdate(
    articleId,
    {
      $addToSet: { dislikedBy: userId },
      $pull: { likedBy: userId },
    },
    {
      new: true,
    }
  )
    .populate("author")
    .exec();
  res.status(HttpStatusCode.OK).json({
    success: true,
    messagge: ResponseMessage.SUCCESS.RESOURCE_UPDATED,
    article: updatedArticle,
  });
};

export const editArticle = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { articleId } = req.params;

  if (!isValidObjectId(articleId)) {
    throw new CustomError("Invalid article ID", HttpStatusCode.BAD_REQUEST);
  }

  const articleData = req.body;

  const updatedArticle = await ArticleModel.findByIdAndUpdate(
    articleId,
    articleData,
    {
      new: true,
    }
  );

  if (!updatedArticle) {
    throw new CustomError(
      "Failed to update article",
      HttpStatusCode.INTERNAL_SERVER_ERROR
    );
  }

  res.status(HttpStatusCode.OK).json({
    success: true,
    message: ResponseMessage.SUCCESS.RESOURCE_UPDATED,
    article: updatedArticle,
  });
};
