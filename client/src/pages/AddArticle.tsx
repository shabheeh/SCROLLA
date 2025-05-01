import { useEffect, useState } from "react";
import { ArrowLeft, Image, X, Clock, Globe, Lock } from "lucide-react";
import { Avatar } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import DOMPurify from "dompurify";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import {
  articleFormSchema,
  ArticleFormValues,
} from "../validators/article.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadImage } from "../utils/uploadToCloudinary";
import { processImagesInContent } from "../helpers/processHtml";
import { getHtmlContentLength } from "../helpers/getHtmlContentLength";
import { IPreference } from "../types/preference.types";
import { addArticle, getArticlePrefernces } from "../services/article.service";
import { toast } from "sonner";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import Header from "../components/Header";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["link", "image"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "code-block",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];

const AddArticle = () => {
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [publishStatus, setPublishStatus] = useState<boolean>(true);
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [featureImage, setFeatureImage] = useState<File | null>(null);
  const [preferences, setPreferences] = useState<IPreference[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [isLoading, setLoading] = useState<boolean>(false);

  const fetchPrefences = async () => {
    try {
      setLoading(true);
      const result = await getArticlePrefernces();
      setPreferences(result.preferences);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrefences();
  }, []);

  const [contentError, setContentError] = useState<string>("");

  const articleForm = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      topics: [],
    },
  });

  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string);
        }
      };
      setFeatureImage(file);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFeatureImage(null);
  };

  const toggleTopic = (id: string, topic: string) => {
    const currentTopics = articleForm.getValues("topics") || [];
    const selectedTopics = articleForm.watch("topics") || [];

    const isSelected = selectedTopics.includes(topic);

    if (isSelected) {
      const updatedTopics = currentTopics.filter((t) => t !== topic);
      articleForm.setValue("topics", updatedTopics);
      const preferenceTopicsStillSelected = updatedTopics.some((t) =>
        preferences.find((pref) => pref._id === id)?.topics.includes(t)
      );

      if (!preferenceTopicsStillSelected) {
        setCategories((prev) => prev.filter((catId) => catId !== id));
      }
    } else {
      if (currentTopics.length < 5) {
        articleForm.setValue("topics", [...currentTopics, topic]);
        setCategories((prev) => (prev.includes(id) ? prev : [...prev, id]));
      }
    }
  };

  const calculateReadTime = () => {
    const wordCount = content.trim().split(/\s+/).filter(word => word !== "").length;
    const readTime = Math.ceil(wordCount / 200);
    return readTime > 0 ? `${readTime} min read` : "Less than 1 min read";
};

  const cleanHtml = () => {
    return DOMPurify.sanitize(content);
  };

  const handlePublish = async (data: ArticleFormValues) => {
    try {
      let featureImageUrl = "";

      if (featureImage) {
        const { secure_url } = await uploadImage(featureImage);
        featureImageUrl = secure_url;
      }

      const htmlcontentLength = getHtmlContentLength(content);

      if (htmlcontentLength === 0) {
        setContentError("Please provide article body");
        return;
      } else if (htmlcontentLength < 199) {
        setContentError("Article body must be 200 characters long");
        return;
      }

      const processedHtml = await processImagesInContent(content);
      const cleanedHtml = DOMPurify.sanitize(processedHtml);

      const articleData = {
        featureImage: featureImageUrl,
        title: data.title,
        subtitle: data.subtitle,
        content: cleanedHtml,
        topics: data.topics,
        visibility: visibility,
        isPublished: publishStatus,
        categories: categories,
        readTime: calculateReadTime(),
      };

      await addArticle(articleData);
      toast.success("Article added");
      navigate(-1);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Somethign went wrong"
      );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="container grid grid-cols-1 md:grid-cols-12 gap-6 p-4 md:p-6 lg:gap-10">
        <div className="md:hidden flex justify-between mb-4 col-span-1">
          <Button
            variant="ghost"
            className="rounded-full cursor-pointer"
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
              className="w-full justify-start cursor-pointer rounded-lg"
              onClick={handleBackClick}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
          </div>
        </div>

        <div className="md:col-span-7 space-y-6">
          {!imagePreview ? (
            <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
              <input
                type="file"
                id="featured-image"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <label
                htmlFor="featured-image"
                className="cursor-pointer flex flex-col items-center"
              >
                <Image className="h-12 w-12 text-muted-foreground mb-2" />
                <h3 className="font-medium mb-1">Add a featured image</h3>
                <p className="text-sm text-muted-foreground">
                  Recommended: 1200×800px (3:2 ratio)
                </p>
              </label>
            </div>
          ) : (
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={imagePreview}
                alt="Featured"
                className="w-full h-auto aspect-video object-cover"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full bg-background/80 backdrop-blur-sm"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Title and subtitle */}
          <div className="space-y-4">
            <Label htmlFor="title" className="mb-1">
              Title
            </Label>
            <Controller
              control={articleForm.control}
              name="title"
              render={({ field }) => (
                <Textarea
                  id="title"
                  placeholder="Enter the title"
                  className="text-4xl font-bold border resize-none p-2 bg-transparent"
                  {...articleForm.register("title")}
                  {...field}
                  rows={1}
                  style={{ minHeight: "unset" }}
                />
              )}
            />
            {articleForm.formState.errors.title && (
              <p className="text-sm text-red-500">
                {articleForm.formState.errors.title.message}
              </p>
            )}

            <Label htmlFor="subtitle" className="mb-1">
              Subtitle
            </Label>
            <Controller
              control={articleForm.control}
              name="subtitle"
              render={({ field }) => (
                <Textarea
                  id="subtitle"
                  placeholder="Enter the Subtitle"
                  className="text-xl text-muted-foreground border resize-none p-2 bg-transparent"
                  {...articleForm.register("subtitle")}
                  {...field}
                  rows={1}
                  style={{ minHeight: "unset" }}
                />
              )}
            />
            {articleForm.formState.errors.subtitle && (
              <p className="text-sm text-red-500">
                {articleForm.formState.errors.subtitle.message}
              </p>
            )}
          </div>
          <Label htmlFor="body" className="mb-1">
            Body
          </Label>
          <ReactQuill
            id="body"
            className="border-0"
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            placeholder="Write something amazing..."
          />
          {contentError && (
            <p className="text-sm text-red-500">{contentError}</p>
          )}
          <div className="bg-muted/30 p-6 rounded-lg">
            <h3 className="font-medium mb-4">Topics (up to 5)</h3>

            <div className="mb-4">
              {articleForm.getValues("topics").length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-4">
                  {articleForm.getValues("topics").map((topic) => (
                    <Badge
                      key={topic}
                      variant="secondary"
                      className="relative rounded-full px-3 py-1 pr-8"
                    >
                      {topic}
                      {/* <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTopic(topic);
                        }}
                        className="absolute top-1/2 right-2 -translate-y-1/2 p-0 m-0 cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button> */}
                    </Badge>
                  ))}
                </div>
              ) : articleForm.formState.errors.topics ? (
                <p className="text-sm text-red-500">
                  {articleForm.formState.errors.topics.message}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground mb-4">
                  Add topics to help readers discover your story
                </p>
              )}
            </div>

            {isLoading && <LoadingSpinner />}

            {preferences.length > 0 && (
              <Tabs defaultValue={preferences[0]._id}>
              <TabsList className="sm:mb-10 mb-40 flex flex-wrap justify-start gap-2">
                {preferences.map((preference) => (
                  <TabsTrigger
                    key={preference._id}
                    value={preference._id}
                    className="flex-grow-0 flex-shrink-0 w-auto px-3 justify-start"
                  >
                    {preference.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            
              {preferences.map((preference) => (
                <TabsContent key={preference._id} value={preference._id}>
                  <div className="w-full">
                    <div className="mb-10 flex flex-wrap justify-start gap-2">
                      {preference.topics.map((topic) => (
                        <Badge
                          key={topic}
                          variant={
                            articleForm.getValues("topics").includes(topic)
                              ? "outline"
                              : "default"
                          }
                          className="rounded-full cursor-pointer hover:bg-muted transition-colors"
                          onClick={() => toggleTopic(preference._id, topic)}
                        >
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
            )}
          </div>
        </div>

        <div className="md:col-span-4">
          <div className="sticky top-24 space-y-6">
            <div className="flex flex-col gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full cursor-pointer rounded-full"
                  >
                    Preview
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-4xl h-[90vh] bg-white">
                  <DialogHeader>
                    <DialogTitle>Preview</DialogTitle>
                    <DialogDescription>
                      Here's how your article will look when published
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex-1 overflow-auto py-4">
                    {/* Preview content would go here */}
                    <h1 className="text-3xl font-bold mb-2">
                      {articleForm.getValues("title") ||
                        "Your Title Will Appear Here"}
                    </h1>
                    {articleForm.getValues("subtitle") && (
                      <p className="text-xl text-muted-foreground mb-4">
                        {articleForm.getValues("subtitle")}
                      </p>
                    )}
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Featured"
                        className="w-full h-auto aspect-video object-cover rounded-lg mb-6"
                      />
                    )}
                    <div
                      className="prose"
                      dangerouslySetInnerHTML={{ __html: cleanHtml() }}
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        variant="outline"
                        className="rounded-full cursor-pointer"
                      >
                        Close
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button
                onClick={articleForm.handleSubmit(handlePublish)}
                className="w-full cursor-pointer rounded-full bg-black text-white hover:bg-black"
              >
                Publish
              </Button>
            </div>

            {/* Publishing options card */}
            <div className="bg-background border rounded-lg p-6 space-y-6">
              <div>
                <h3 className="font-medium mb-2">Visibility</h3>
                <div className="space-y-2">
                  <div className="flex items-center ms-3 gap-3">
                    <input
                      className="cursor-pointer"
                      type="radio"
                      id="public"
                      name="visibility"
                      value="public"
                      checked={visibility === "public"}
                      onChange={() => setVisibility("public")}
                    />
                    <label
                      htmlFor="public"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Globe className="h-4 w-4" />
                      <div>
                        <span className="font-medium">Public</span>
                        <p className="text-xs text-muted-foreground">
                          Anyone on Scrolla can access
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="flex items-center ms-3 gap-3">
                    <input
                      className="cursor-pointer"
                      type="radio"
                      id="private"
                      name="visibility"
                      value="private"
                      checked={visibility === "private"}
                      onChange={() => setVisibility("private")}
                    />
                    <label
                      htmlFor="private"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Lock className="h-4 w-4" />
                      <div>
                        <span className="font-medium">Private</span>
                        <p className="text-xs text-muted-foreground">
                          Only you can access
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-300" />

              <div>
                <h3 className="font-medium mb-2">Status</h3>
                <div className="space-y-2">
                  <div className="flex items-center ms-3 gap-3">
                    <input
                      className="cursor-pointer"
                      type="radio"
                      id="publish-now"
                      name="publish-status"
                      value="publish-now"
                      checked={publishStatus}
                      onChange={() => setPublishStatus(true)}
                    />
                    <label htmlFor="publish-now" className="cursor-pointer">
                      Publish now
                    </label>
                  </div>

                  <div className="flex items-center ms-3 gap-3">
                    <input
                      className="cursor-pointer"
                      type="radio"
                      id="save-draft"
                      name="publish-status"
                      value="save-draft"
                      checked={!publishStatus}
                      onChange={() => setPublishStatus(false)}
                    />
                    <label htmlFor="save-draft" className="cursor-pointer">
                      Save as draft
                    </label>
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-300" />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Story details</h3>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center ms-3 gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{calculateReadTime()}</span>
                  </div>
                  <div className="flex items-center ms-3 gap-2">
                    <span>Topics:</span>
                    <span>
                      {articleForm.getValues("topics").length
                        ? articleForm.getValues("topics").join(", ")
                        : "None selected"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg">
              <h3 className="font-medium mb-3">Writing tips</h3>
              <ul className="text-sm space-y-2">
                <li>• Start with a compelling headline</li>
                <li>• Include relevant images to break up text</li>
                <li>• Keep paragraphs short and scannable</li>
                <li>• End with a clear call to action</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddArticle;
