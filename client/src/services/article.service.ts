import { IArticle, IArticleInput } from "../types/article.types";
import { IPreference } from "../types/preference.types";
import api from "../utils/axios.interceptor";

export const getArticlePrefernces = async (): Promise<{
  success: boolean;
  message: string;
  preferences: IPreference[];
}> => {
  try {
    const response = await api.get("/preferences");
    return response.data;
  } catch (error) {
    console.log(error);

    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      console.log(error);
      throw new Error("An error occured");
    }
  }
};

export const addArticle = async (
  articleData: IArticleInput
): Promise<{ success: true; message: string }> => {
  try {
    console.log(articleData);
    const response = await api.post("/articles", articleData);
    return response.data;
  } catch (error) {
    console.log(error);

    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      console.log(error);
      throw new Error("An error occured");
    }
  }
};

export const getArticles = async (
  searchValue: string,
  preference: string
): Promise<IArticle[]> => {
  try {
    const response = await api.get(
      `/articles?searchQuery=${searchValue}&preference=${preference}`
    );
    const { articles } = response.data;
    return articles;
  } catch (error) {
    console.log(error);

    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      console.log(error);
      throw new Error("An error occured");
    }
  }
};

export const getTrendingArticles = async (): Promise<IArticle[]> => {
  try {
    const response = await api.get("/trending");
    return response.data.trendingArticles;
  } catch (error) {
    console.log(error);

    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      console.log(error);
      throw new Error("An error occured");
    }
  }
};

export const getArticle = async (articleId: string): Promise<IArticle> => {
  try {
    const response = await api.get(`/articles/${articleId}`);
    return response.data.article;
  } catch (error) {
    console.log(error);

    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      console.log(error);
      throw new Error("An error occured");
    }
  }
};

export const getUserArticles = async (userId: string): Promise<IArticle[]> => {
  try {
    const response = await api.get(`/users/${userId}/articles`);
    return response.data.articles;
  } catch (error) {
    console.log(error);

    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      console.log(error);
      throw new Error("An error occured");
    }
  }
};

export const likeArticle = async (
  articleId: string
): Promise<IArticle> => {
  try {
    const response = await api.patch(`/articles/${articleId}/like`);

    return response.data.article;
  } catch (error) {
    console.log(error);

    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      console.log(error);
      throw new Error("An error occured");
    }
  }
};

export const dislikeArticle = async (
  articleId: string
): Promise<IArticle> => {
  try {
    const response = await api.patch(`/articles/${articleId}/dislike`);

    return response.data.article;
  } catch (error) {
    console.log(error);

    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      console.log(error);
      throw new Error("An error occured");
    }
  }
};