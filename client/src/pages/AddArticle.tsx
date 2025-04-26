import { useState } from "react";
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
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { useNavigate } from "react-router-dom";

const topicCategoryMap = {
  Programming: [
    "JavaScript",
    "React",
    "TypeScript",
    "Node.js",
    "Python",
    "CSS",
    "HTML",
    "Data Science",
  ],
  Design: [
    "UI/UX",
    "Web Design",
    "Graphic Design",
    "Design Systems",
    "Typography",
    "Color Theory",
  ],
  Productivity: [
    "Time Management",
    "Personal Growth",
    "Career",
    "Work-Life Balance",
    "Freelancing",
  ],
  Technology: [
    "Artificial Intelligence",
    "Machine Learning",
    "Blockchain",
    "Web3",
    "Cloud Computing",
    "Cybersecurity",
  ],
  Marketing: [
    "Content Marketing",
    "SEO",
    "Social Media Marketing",
    "Email Marketing",
    "Brand Strategy",
    "Growth Hacking",
    "Affiliate Marketing",
  ],
  "Health & Wellness": [
    "Fitness",
    "Nutrition",
    "Mental Health",
    "Yoga",
    "Meditation",
    "Healthy Living",
  ],
  "Buisiness & Finance": [
    "Entrepreneurship",
    "Startups",
    "Investing",
    "Personal Finance",
    "Leadership",
    "E-commerce",
    "Economics",
  ],
  "Writing & Communication": [
    "Creative Writing",
    "Technical Writing",
    "Copywriting",
    "Storytelling",
    "Public Speaking",
    "Blogging",
    "Editing",
  ],
};

const topicCategories = Object.entries(topicCategoryMap).map(
  ([name, topics]) => ({
    id: name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
    name,
    topics,
  })
);

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["link", "image", "video"],
    ["clean"], // remove formatting
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
  "video",
];

const ScrollaWriteArticle = () => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [publishStatus, setPublishStatus] = useState<boolean>(false);
  const [visibility, setVisibility] = useState("public");

  const naviage = useNavigate();

  const handleBackClick = () => {
    naviage(-1)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
  };

  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      if (selectedTopics.length < 5) {
        setSelectedTopics([...selectedTopics, topic]);
      }
    }
  };

  const calculateReadTime = () => {
    const wordCount = content.trim().split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);
    return readTime > 0 ? `${readTime} min read` : "Less than 1 min read";
  };

  const cleanHtml = () => {
    return DOMPurify.sanitize(content);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/60 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Scrolla</h1>
          </div>
          <div className="flex items-center gap-4">
            <Avatar className="h-8 w-8 cursor-pointer">
              <img src="/api/placeholder/40/40" alt="User" />
            </Avatar>
          </div>
        </div>
      </header>

      <main className="container grid grid-cols-1 md:grid-cols-12 gap-6 p-4 md:p-6 lg:gap-10">
        <div className="md:hidden flex justify-between mb-4 col-span-1">
          <Button variant="ghost" className="rounded-full"
          onClick={handleBackClick}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          <Button variant="outline" className="rounded-full">
            Save draft
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

        {/* Article editor - main area */}
        <div className="md:col-span-7 space-y-6">
          {/* Featured image upload */}
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
            <Textarea
              id="title"
              placeholder="Enter the title"
              className="text-4xl font-bold border resize-none p-2 bg-transparent"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              rows={1}
              style={{ minHeight: "unset" }}
            />
            <Label htmlFor="subtitle" className="mb-1">
              Subtitle
            </Label>
            <Textarea
              id="subtitle"
              placeholder="Enter the Subtitle"
              className="text-xl text-muted-foreground border resize-none p-2 bg-transparent"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              rows={1}
              style={{ minHeight: "unset" }}
            />
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

          {/* Topics/Tags selector */}
          <div className="bg-muted/30 p-6 rounded-lg">
            <h3 className="font-medium mb-4">Topics (up to 5)</h3>

            <div className="mb-4">
              {selectedTopics.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedTopics.map((topic) => (
                    <Badge
                      key={topic}
                      variant="secondary"
                      className="relative rounded-full px-3 py-1 pr-8"
                    >
                      {topic}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTopic(topic);
                        }}
                        className="absolute top-1/2 right-2 -translate-y-1/2 p-0 m-0 cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mb-4">
                  Add topics to help readers discover your story
                </p>
              )}
            </div>

            <Tabs defaultValue={topicCategories[0].id}>
              <TabsList className="mb-10 flex flex-wrap justify-start gap-2">
                {topicCategories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="flex-grow-0 flex-shrink-0 w-auto px-3 justify-start"
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {topicCategories.map((category) => (
                <TabsContent key={category.id} value={category.id}>
                  <div className="flex flex-wrap gap-2">
                    {category.topics.map((topic) => (
                      <Badge
                        key={topic}
                        variant={
                          selectedTopics.includes(topic) ? "outline" : "default"
                        }
                        className="rounded-full cursor-pointer hover:bg-muted transition-colors"
                        onClick={() => toggleTopic(topic)}
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>

        {/* Right sidebar - publishing options */}
        <div className="md:col-span-4">
          <div className="sticky top-24 space-y-6">
            {/* Preview and publish buttons */}
            <div className="flex flex-col gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full cursor-pointer rounded-full">
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
                      {title || "Your Title Will Appear Here"}
                    </h1>
                    {subtitle && (
                      <p className="text-xl text-muted-foreground mb-4">
                        {subtitle}
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
                    <Button variant="outline" className="rounded-full">
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button className="w-full cursor-pointer rounded-full bg-black text-white hover:bg-black">
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
                      {selectedTopics.length
                        ? selectedTopics.join(", ")
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
              <Button variant="link" className="p-0 h-auto mt-2 text-sm">
                Learn more about writing on Scrolla
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ScrollaWriteArticle;
