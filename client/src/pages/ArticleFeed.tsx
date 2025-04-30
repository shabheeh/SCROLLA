import {
  Search,
  ThumbsUp,
  ThumbsDown,
  Edit,
  EllipsisVertical,
} from "lucide-react";
import { Avatar } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";
import { useEffect, useState } from "react";
import { IPreference } from "../types/preference.types";
import { toast } from "sonner";
import {
  dislikeArticle,
  getArticlePrefernces,
  getArticles,
  getTrendingArticles,
  likeArticle,
} from "../services/article.service";
import { IArticle } from "../types/article.types";
import { formatDate } from "../helpers/formateDate";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

const ArticleFeed = () => {
  const [preferences, setPreferences] = useState<IPreference[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [selectedPreference, setSelectedPreference] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>(searchValue);
  const [trendingArticles, setTrendingArticles] = useState<IArticle[]>();

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const intervelId = setInterval(() => {
      setDebouncedSearch(searchValue);
    }, 500);

    return () => {
      clearInterval(intervelId);
    };
  }, [searchValue]);

  useEffect(() => {
    fetchArticles();
  }, [selectedPreference, debouncedSearch]);

  const fetchPrefences = async () => {
    try {
      const result = await getArticlePrefernces();
      setPreferences(result.preferences);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  const fetchArticles = async () => {
    try {
      const result = await getArticles(debouncedSearch, selectedPreference);
      setArticles(result);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  const fetchTrendingArticles = async () => {
    try {
      const result = await getTrendingArticles();
      setTrendingArticles(result);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  useEffect(() => {
    fetchPrefences();
    fetchTrendingArticles();
  }, []);

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
      setArticles((prevArticles) =>
        prevArticles.map((article) =>
          article._id === result._id ? result : article
        )
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  const handleArticleDislike = async (articleId: string) => {
    try {
      const result = await dislikeArticle(articleId);
      setArticles((prevArticles) =>
        prevArticles.map((article) =>
          article._id === result._id ? result : article
        )
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  const TrendingSection = () => (
    <div className="bg-background p-4 sm:p-6 rounded-lg">
      <h2 className="font-bold text-xl mb-4">Trending</h2>
      <div className="space-y-6">
        {trendingArticles &&
          trendingArticles.map((article, index) => (
            <div
              key={article._id}
              onClick={() =>
                handleArticleClick(
                  article._id,
                  article.author._id,
                  article.title
                )
              }
            >
              <div className="flex gap-3 group cursor-pointer">
                <Avatar className="h-6 w-6 flex-shrink-0">
                  {article.author.profilePicture ? (
                    <img
                      className="h-full w-full rounded-full object-cover"
                      src={article.author.profilePicture}
                      alt="author profile picture"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full bg-gray-200 text-gray-600">
                      {user?.firstName[0]}
                      {user?.lastName[0]}
                    </div>
                  )}
                </Avatar>
                <div>
                  <span className="text-sm font-medium">
                    {article.author.firstName}
                  </span>
                  <h3 className="font-medium">{article.title}</h3>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(article.createdAt)}
                  </span>
                </div>
              </div>
              {index < trendingArticles.length - 1 && (
                <Separator className="my-4" />
              )}
            </div>
          ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-2 sm:px-4 md:px-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold">SCROLLA</h1>
          </div>

          {/* Search - hidden on smallest screens */}
          <div className="hidden sm:block relative w-full max-w-sm px-2 sm:px-4">
            <Search className="absolute left-4 sm:left-6 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
            <Input
              className="w-full rounded-full bg-muted/70 pl-8 sm:pl-10 border-none"
              placeholder="Search"
              type="search"
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search button on smallest screens */}
            <Button
              className="sm:hidden rounded-full"
              variant="ghost"
              size="sm"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Write button */}
            <Button
              className="rounded-full cursor-pointer"
              variant="ghost"
              onClick={() => navigate && navigate("/write")}
            >
              <Edit className="h-5 w-5" />
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  className="lg:hidden rounded-full"
                  variant="ghost"
                  size="sm"
                >
                  <span className="sr-only">Trending</span>
                  <span className="text-sm font-medium">🔥</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full bg-white sm:w-96 p-0 h-[85vh] mt-16 rounded-t-lg border-t"
              >
                <div className="p-4 h-full overflow-auto">
                  <TrendingSection />
                </div>
              </SheetContent>
            </Sheet>
            <div
              onClick={() => navigate("/profile")}
              className="h-8 w-8 rounded-full cursor-pointer bg-gray-100 flex items-center justify-center"
            >
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="User"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <span className="text-gray-600 text-xl">
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="container px-2 sm:px-4 md:px-6 pb-2">
          <div className="flex justify-center">
            <div className="relative w-full max-w-3xl">
              <Carousel
                opts={{
                  align: "center",
                  loop: false,
                  slidesToScroll: 1,
                }}
                className="w-auto mx-8 sm:mx-12"
              >
                <CarouselContent className="py-1">
                  <CarouselItem
                    key="for-you"
                    className="basis-auto min-w-min px-1"
                  >
                    <Button
                      variant={selectedPreference === "" ? "outline" : "ghost"}
                      size="sm"
                      className="rounded-full whitespace-nowrap text-xs sm:text-sm"
                      onClick={() => setSelectedPreference("")}
                    >
                      For you
                    </Button>
                  </CarouselItem>
                  {preferences.map((preference) => (
                    <CarouselItem
                      key={preference._id}
                      className="basis-auto min-w-min px-1"
                    >
                      <Button
                        variant={
                          selectedPreference === preference._id
                            ? "outline"
                            : "ghost"
                        }
                        size="sm"
                        className="rounded-full whitespace-nowrap text-xs sm:text-sm"
                        onClick={() => setSelectedPreference(preference._id)}
                      >
                        {preference.name}
                      </Button>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious
                  className="h-6 w-6 sm:h-8 sm:w-8 absolute -left-6 sm:-left-10 bg-transparent border-none hover:bg-transparent hover:opacity-80"
                  variant="ghost"
                />
                <CarouselNext
                  className="h-6 w-6 sm:h-8 sm:w-8 absolute -right-6 sm:-right-10 bg-transparent border-none hover:bg-transparent hover:opacity-80"
                  variant="ghost"
                />
              </Carousel>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full grid gap-6 p-2 sm:p-4 md:p-6 mx-auto lg:grid-cols-12 lg:gap-8">
        <div className="hidden lg:block lg:col-span-1"></div>

        <div className="lg:col-span-7">
          {articles.map((article, index) => (
            <div
              key={article._id}
              className="mb-8 cursor-pointer"
              onClick={() =>
                handleArticleClick(
                  article._id,
                  article.author._id,
                  article.title
                )
              }
            >
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="h-6 w-6">
                  {article.author.profilePicture ? (
                    <img
                      className="h-full w-full rounded-full object-cover"
                      src={article.author.profilePicture}
                      alt="author profile picture"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full bg-gray-200 text-gray-600">
                      {user?.firstName[0]}
                      {user?.lastName[0]}
                    </div>
                  )}
                </Avatar>
                <span className="text-sm font-medium">
                  {article.author.firstName} {article.author.lastName}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1">
                    {article.title}
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground mb-2 line-clamp-2 sm:line-clamp-3">
                    {article.subtitle}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                    <span>{formatDate(article.createdAt)}</span>
                    <span>{article.readTime}</span>
                    {article.topics.length > 0 &&
                      article.topics.map((topic, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="rounded-full text-xs"
                        >
                          {topic}
                        </Badge>
                      ))}
                    {article.topics.length > 2 && (
                      <span className="text-xs">
                        +{article.topics.length - 2}
                      </span>
                    )}
                  </div>
                </div>
                {article.featureImage && (
                  <div className="sm:col-span-1">
                    <img
                      src={article.featureImage}
                      alt={article.title}
                      className="w-full h-32 sm:h-40 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 rounded-full cursor-pointer"
                    onClick={(e) => {
                      handleArticleLike(article._id);
                      e.stopPropagation();
                    }}
                  >
                    {user && article.likedBy.includes(user._id) ? (
                      <ThumbsUp className="h-4 w-4 fill-black" />
                    ) : (
                      <ThumbsUp className="h-4 w-4" />
                    )}
                    <span>{article.likedBy?.length || 0}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 rounded-full cursor-pointer"
                    onClick={(e) => {
                      handleArticleDislike(article._id);
                      e.stopPropagation();
                    }}
                  >
                    {user && article.dislikedBy.includes(user._id) ? (
                      <ThumbsDown className="h-4 w-4 fill-black" />
                    ) : (
                      <ThumbsDown className="h-4 w-4" />
                    )}
                    <span>{article.dislikedBy?.length || 0}</span>
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <EllipsisVertical className="h-4 w-4" />
                </Button>
              </div>

              {index < articles.length - 1 && (
                <Separator className="mt-8 bg-gray-300" />
              )}
            </div>
          ))}
          {articles.length === 0 && (
            <div className="flex items-center gap-2 mb-2">
              <div className="text-lg font-bold justify-center align-middle">
                No Articles found please adjust the search input or the
                preference
              </div>
            </div>
          )}
        </div>

        <div className="hidden lg:block lg:col-span-4 border-l border-gray-300 space-y-8">
          <TrendingSection />
        </div>
      </main>
    </div>
  );
};
export default ArticleFeed;
