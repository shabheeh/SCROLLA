import {
  ThumbsUp,
  EllipsisVertical,
  ThumbsDown,
  ArrowLeft,
} from "lucide-react";
import { Avatar } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import { useEffect, useState } from "react";
import { IArticle } from "../types/article.types";
import { useLocation, useNavigate } from "react-router-dom";
import {
  dislikeArticle,
  getArticle,
  getUserArticles,
  likeArticle,
} from "../services/article.service";
import { toast } from "sonner";
import { formatDate } from "../helpers/formateDate";

import DOMPurify from "dompurify";
import { useAuth } from "../contexts/authContext";
import Header from "../components/Header";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

const ArticleView = () => {
  const [article, setArticle] = useState<IArticle | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [articles, setArticles] = useState<IArticle[]>([]);

  const articleId = location.state.articleId;
  const authorId = location.state.authorId;

  const fetchArticle = async () => {
    if (!articleId) {
      return;
    }
    try {
      setLoading(true);
      const result = await getArticle(articleId);
      setArticle(result);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchUserArticle = async () => {
    if (!authorId || !articleId) {
      return;
    }

    try {
      const result = await getUserArticles(authorId);
      const filtredArticle = result.filter(
        (article) => article._id !== articleId
      );
      setArticles(filtredArticle);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  useEffect(() => {
    fetchArticle();
    fetchUserArticle();
  }, []);

  const cleanHtml = (content: string) => {
    return DOMPurify.sanitize(content);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleArticleClick = (
    articleId: string,
    authorId: string,
    titile: string
  ) => {
    navigate(`/${titile}`, { state: { articleId, authorId } });
  };

  const handleArticleLike = async (articleId: string) => {
    try {
      const result = await likeArticle(articleId);
      setArticle(result);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  const handleArticleDislike = async (articleId: string) => {
    try {
      const result = await dislikeArticle(articleId);
      setArticle(result);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="container grid grid-cols-1 gap-6 p-4 md:grid-cols-12 md:p-6 lg:gap-10">
        <div className="md:hidden flex justify-between mb-4 col-span-1">
          <Button
            variant="ghost"
            className="rounded-full"
            onClick={handleBackClick}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
        </div>
        <div className="hidden md:block md:col-span-1">
          <div className="sticky top-24 space-y-4">
            <Button
              variant="ghost"
              className="w-full justify-start rounded-lg"
              onClick={handleBackClick}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
          </div>
        </div>

        {loading && (
          <div className="md:col-span-7">
            <LoadingSpinner />
          </div>
        )}

        {article && (
          <div className="md:col-span-7">
            <h1 className="text-3xl font-bold mb-2 md:text-4xl">
              {article.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              {article.subtitle}
            </p>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  {article.author?.profilePicture ? (
                    <img
                      className="h-full w-full rounded-full object-cover"
                      src={article.author.profilePicture}
                      alt="user profile picture"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full bg-gray-200 text-gray-600">
                      {user?.firstName[0]}
                      {user?.lastName[0]}
                    </div>
                  )}
                </Avatar>
                <div>
                  <div className="flex items-center">
                    <h3 className="font-medium">
                      {article.author.firstName} {article.author.lastName}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      {formatDate(article.createdAt)} · {article.readTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-8">
              {article.featureImage && (
                <img
                  src={article.featureImage}
                  alt={article.title}
                  className="w-full h-auto aspect-video object-cover rounded-lg"
                />
              )}
            </div>
            <div
              className="prose max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: cleanHtml(article.content) }}
            />

            <div className="flex flex-wrap gap-2 mb-8">
              {article.topics.map((topic, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="rounded-full px-4 py-2"
                >
                  {topic}
                </Badge>
              ))}
            </div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 rounded-full cursor-pointer"
                  onClick={() => handleArticleLike(article._id)}
                >
                  {user && article.likedBy.includes(user._id) ? (
                    <ThumbsUp className="h-4 w-4 fill-black" />
                  ) : (
                    <ThumbsUp className="h-4 w-4" />
                  )}

                  <span>{article.likedBy.length}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 rounded-full cursor-pointer"
                  onClick={() => handleArticleDislike(article._id)}
                >
                  {user && article.dislikedBy.includes(user._id) ? (
                    <ThumbsDown className="h-4 w-4 fill-black" />
                  ) : (
                    <ThumbsDown className="h-4 w-4" />
                  )}
                  <span>{article.dislikedBy.length}</span>
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full cursor-pointer"
                >
                  <EllipsisVertical className="h-4 w-4" />
                </Button>
                {/* <Button variant="ghost" size="sm" className="rounded-full">
                  <Flag className="h-4 w-4" />
                </Button> */}
              </div>
            </div>

            <Separator className="mb-8" />

            <div className="mb-8">
              {/* <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  Comments ({article.comments})
                </h2>
                <Button variant="outline" size="sm" className="rounded-full">
                  Most relevant
                </Button>
              </div> */}

              {/* Add comment */}
              {/* <div className="flex gap-4 mb-8">
                <Avatar className="h-10 w-10">
                  <img src="/api/placeholder/40/40" alt="User" />
                </Avatar>
                <div className="flex-1">
                  <Input
                    className="w-full bg-muted/50 border-none"
                    placeholder="Add a comment..."
                  />
                </div>
              </div> */}

              {/* <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <Avatar className="h-10 w-10">
                      <img src={comment.avatar} alt={comment.author} />
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{comment.author}</h4>
                        <span className="text-xs text-muted-foreground">
                          {comment.date}
                        </span>
                      </div>
                      <p className="mb-2">{comment.text}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 h-8 rounded-full"
                        >
                          <ThumbsUp className="h-3 w-3" />
                          <span>{comment.likes}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 rounded-full"
                        >
                          Reply
                        </Button>
                        {comment.replies > 0 && (
                          <Button
                            variant="link"
                            size="sm"
                            className="h-8 rounded-full"
                          >
                            View {comment.replies}{" "}
                            {comment.replies === 1 ? "reply" : "replies"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div> */}

              {!article && (
                <div className="md:col-span-7">
                  <h6>No Article Found</h6>
                </div>
              )}

              {/* <Button variant="outline" className="w-full mt-6 rounded-full">
                Show more comments
              </Button> */}
            </div>
          </div>
        )}

        <div className="md:col-span-4 space-y-8">
          {article && (
            <div className="sticky top-32 bg-background p-6 rounded-lg border">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-12 w-12">
                  {article.author?.profilePicture ? (
                    <img
                      className="h-full w-full rounded-full object-cover"
                      src={article.author.profilePicture}
                      alt="user profile picture"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full bg-gray-200 text-gray-600">
                      {user?.firstName[0]}
                      {user?.lastName[0]}
                    </div>
                  )}
                </Avatar>
                <div>
                  <h3 className="text-lg font-bold">
                    {article.author.firstName}
                  </h3>
                  <p className="text-sm mb-4">{article.author.email}</p>
                </div>
              </div>
              <p className="text-sm mb-4">
                Member since {formatDate(article.author.createdAt)}
              </p>
              {articles.length > 0 && (
                <>
                  <Separator className="my-6 bg-gray-300" />
                  <h4 className="font-bold mb-4">More from the author</h4>
                  <div className="space-y-4"></div>
                  {articles.map((article, idx) => (
                    <div
                      onClick={() =>
                        handleArticleClick(
                          article._id,
                          article.author._id,
                          article.title
                        )
                      }
                      key={idx}
                      className="group cursor-pointer"
                    >
                      <h5 className="font-medium group-hover:text-primary">
                        {article.title}
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(article.createdAt)} {article.readTime}
                      </p>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ArticleView;
