import { IUser } from "./user.types";

export interface IArticle {
    _id: string;
    author: IUser;
    featureImage: string;
    title: string;
    subtitle: string;
    content: string;
    topics: string[];
    categories: string[];
    readTime: number;
    visibility: "public" | "private";
    isPublished: boolean;
    likedBy: string[];
    dislikedBy: string[];
    blockedBy: string[];
    createdAt: Date;
}

export type IArticleInput = {
    featureImage: string;
    title: string;
    subtitle: string;
    content: string;
    topics: string[];
    categories: string[]
    visibility: "public" | "private";
    isPublished: boolean;
    readTime: string;
}
