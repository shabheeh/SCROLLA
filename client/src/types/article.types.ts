export interface IArticle {
    userId: string;
    featureImage: string;
    title: string;
    subtitle: string;
    body: string;
    topics: string[];
    visibility: "public" | "private";
    isPublished: boolean;
}

export type IArticleInput = {
    userId: string;
    featureImage: File | null;
    title: string;
    subtitle: string;
    body: string;
    topics: string[];
    visibility: "public" | "private";
    isPublished: boolean;
}
