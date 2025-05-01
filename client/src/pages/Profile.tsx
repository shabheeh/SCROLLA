import { useEffect, useState } from "react";
import {
  User,
  Settings,
  PenSquare,
  Bookmark,
  LogOut,
  Upload,
  Eye,
  EyeOff,
  Check,
  Camera,
  ArrowLeft,
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../helpers/formateDate";
import {
  changePassword,
  signoutUser,
  updateProfile,
} from "../services/auth.service";
import { toast } from "sonner";
import {
  profileFormSchema,
  ProfileFormValues,
} from "../validators/profile.validate";
import { Label } from "../components/ui/label";
import { IPreference } from "../types/preference.types";
import {
  addArticle,
  getArticlePrefernces,
  getUserArticles,
} from "../services/article.service";
import { Checkbox } from "../components/ui/checkbox";
import { uploadImage } from "../utils/uploadToCloudinary";
import {
  passwordFormSchema,
  PasswordFormValues,
} from "../validators/password.validator";
import Header from "../components/Header";
import { IArticle } from "../types/article.types";
import { Button } from "../components/ui/button";

import EditArticle from "../components/EditArticle";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [profileUpdated, setProfileUpdated] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [preferences, setPreferences] = useState<IPreference[]>([]);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [isArticlesLaoding, setArticlesLoading] = useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<IArticle | null>(null);
  const [isArticleEditing, setArticleEditng] = useState<boolean>(false);

  const { user, signout, updateUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPrefences();
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    if (!user) {
      return null;
    }
    try {
      setArticlesLoading(true);
      const result = await getUserArticles(user._id);
      setArticles(result);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setArticlesLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      email: user?.email || "",
      dob: user ? new Date(user.dob) : new Date(),
      preferences: user?.preferences || [],
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

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

  const handleProfilePictureUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfilePicturePreview(event.target.result as string);
        }
      };
      setProfilePicture(file);
      reader.readAsDataURL(file);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPasswordUpdated(false);
    setProfileUpdated(false);
    setSelectedArticle(null)
    setArticleEditng(false)
  };

  const handlePasswordUpdate = async (data: PasswordFormValues) => {
    try {
      await changePassword(data.currentPassword, data.password);
      toast.success("Password changed successfully");
      profileForm.reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  const handleProfileUpdate = async (data: ProfileFormValues) => {
    try {
      let imageUrl = "";

      if (profilePicture) {
        const { secure_url } = await uploadImage(profilePicture);
        imageUrl = secure_url;
      }

      const userData = {
        profilePicture: imageUrl || user?.profilePicture,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        dob: data.dob,
        preferences: data.preferences,
      };

      const result = await updateProfile(userData);
      updateUser(result);
      toast.success("Profile updated Successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  const handleSignout = async () => {
    try {
      await signoutUser();
      signout();
      navigate("/");
      toast.success("Signout successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  const handleEditArticle = (article: IArticle) => {
    setSelectedArticle(article)
    setArticleEditng(true)
  }

  const handleCancelEditArticle = () => {
    setSelectedArticle(null)
    setArticleEditng(false)
    fetchArticles()
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="container grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-8 p-4 md:p-6">
        <div className="md:col-span-3 space-y-4">
          <div className="sticky top-24 p-4">
            <div className=" md:block md:col-span-1">
              <div className="sticky top-24 space-y-4">
                <Button
                  variant="ghost"
                  className="w-full justify-start cursor-pointer rounded-lg"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back
                </Button>
              </div>
            </div>
            <div className="flex flex-col items-center text-center mb-8">
              <div className="relative mb-4">
                <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center">
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="User"
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 text-2xl">
                      {user?.firstName?.[0]}
                      {user?.lastName?.[0]}
                    </span>
                  )}
                </div>
                {activeTab === "profile" && (
                  <div className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full cursor-pointer">
                    <Upload className="h-4 w-4" />
                  </div>
                )}
              </div>
              <h2 className="text-xl font-bold">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {/* Member since {formatDate(user.createdAt)} */}
              </p>
            </div>

            <div className="space-y-1">
              <button
                className={`flex items-center w-full p-3 rounded-lg ${
                  activeTab === "profile"
                    ? "bg-secondary/50 font-bold"
                    : "hover:bg-secondary/20"
                }`}
                onClick={() => handleTabChange("profile")}
              >
                <User
                  className={`h-5 w-5 mr-3 ${
                    activeTab === "profile" ? "font-bold" : ""
                  }`}
                />
                <span>Edit Profile</span>
              </button>
              <button
                className={`flex items-center w-full p-3 rounded-lg ${
                  activeTab === "articles"
                    ? "bg-secondary/50 font-medium"
                    : "hover:bg-secondary/20"
                }`}
                onClick={() => handleTabChange("articles")}
              >
                <PenSquare className="h-5 w-5 mr-3" />
                <span>My Articles</span>
              </button>
              <button
                className={`flex items-center w-full p-3 rounded-lg ${
                  activeTab === "saved"
                    ? "bg-secondary/50 font-medium"
                    : "hover:bg-secondary/20"
                }`}
                onClick={() => handleTabChange("saved")}
              >
                <Bookmark className="h-5 w-5 mr-3" />
                <span>Saved Articles</span>
              </button>
              <button
                className={`flex items-center w-full p-3 rounded-lg ${
                  activeTab === "security"
                    ? "bg-secondary/50 font-bold"
                    : "hover:bg-secondary/20"
                }`}
                onClick={() => handleTabChange("security")}
              >
                <Settings className="h-5 w-5 mr-3 bold-icon" />
                <span>Password & Security</span>
              </button>
            </div>

            <div className="pt-6 mt-6 border-t">
              <button
                onClick={handleSignout}
                className="flex items-center w-full p-3 rounded-lg text-red-500 hover:bg-red-50"
              >
                <LogOut className="h-5 w-5 mr-3" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        <div className="hidden md:block md:col-span-1">
          <div className="h-full w-px bg-gray-200 mx-auto"></div>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-8 pt-6 md:pt-0">
          {activeTab === "profile" && (
            <div className="px-2">
              <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

              {profileUpdated && (
                <div className="mb-6 p-3 bg-green-50 rounded-lg flex items-center text-green-700">
                  <Check className="h-5 w-5 mr-2" />
                  Profile updated successfully!
                </div>
              )}

              <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)}>
                <div className="mb-8 flex">
                  <div className="relative justify-center">
                    {profilePicturePreview ? (
                      <div className="h-26 w-26 rounded-full bg-gray-100 flex items-center justify-center">
                        <img
                          className="h-full w-full rounded-full object-cover"
                          src={profilePicturePreview}
                          alt="User"
                        />
                      </div>
                    ) : (
                      <div className="h-26 w-26 rounded-full bg-gray-100 flex items-center justify-center">
                        {user?.profilePicture ? (
                          <img
                            className="h-full w-full rounded-full object-cover"
                            src={user.profilePicture}
                            alt="User"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full w-full bg-gray-200 text-gray-600 text-2xl">
                            {user?.firstName[0]}
                            {user?.lastName[0]}
                          </div>
                        )}
                      </div>
                    )}
                    <label
                      htmlFor="profile-picture"
                      className="absolute bottom-0 right-0 p-1 bg-primary text-primary-foreground rounded-full cursor-pointer"
                    >
                      <Camera className="h-4 w-4" />
                      <input
                        id="profile-picture"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfilePictureUpload}
                      />
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <Label className="block text-sm font-medium mb-2">
                      First Name
                    </Label>

                    <Controller
                      control={profileForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <input
                          type="text"
                          className="w-full p-3 border-b bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/20"
                          {...field}
                        />
                      )}
                    />
                    {profileForm.formState.errors.firstName && (
                      <p className="text-sm text-red-500">
                        {profileForm.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Last Name
                    </label>
                    <Controller
                      control={profileForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <input
                          type="text"
                          className="w-full p-3 border-b bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/20"
                          {...field}
                        />
                      )}
                    />
                    {profileForm.formState.errors.lastName && (
                      <p className="text-sm text-red-500">
                        {profileForm.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <Controller
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <input
                          type="email"
                          className="w-full p-3 border-b bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/20"
                          {...field}
                        />
                      )}
                    />
                    {profileForm.formState.errors.email && (
                      <p className="text-sm text-red-500">
                        {profileForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone
                    </label>
                    <Controller
                      control={profileForm.control}
                      name="phone"
                      render={({ field }) => (
                        <input
                          type="text"
                          className="w-full p-3 border-b bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/20"
                          {...field}
                        />
                      )}
                    />
                    {profileForm.formState.errors.phone && (
                      <p className="text-sm text-red-500">
                        {profileForm.formState.errors.phone.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      DOB
                    </label>
                    <Controller
                      control={profileForm.control}
                      name="dob"
                      render={({ field }) => (
                        <input
                          className=""
                          id="dob"
                          type="date"
                          max={new Date().toISOString().split("T")[0]}
                          value={
                            field.value
                              ? new Date(field.value)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value ? new Date(value) : null);
                          }}
                        />
                      )}
                    />

                    {profileForm.formState.errors.dob && (
                      <p className="text-sm text-red-500">
                        {profileForm.formState.errors.dob.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-3">
                    <Label>Article Preferences</Label>
                    {/* {loading && <LoadingSpinner />} */}
                    {preferences.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {preferences.map((preference) => (
                          <div
                            key={preference._id}
                            className="flex items-center space-x-2"
                          >
                            <Controller
                              control={profileForm.control}
                              name="preferences"
                              render={({ field }) => {
                                const isChecked = field.value.includes(
                                  preference._id
                                );

                                const handleChange = (
                                  checked: boolean | "indeterminate"
                                ) => {
                                  const newValue =
                                    checked === true
                                      ? [...field.value, preference._id]
                                      : field.value.filter(
                                          (id: string) => id !== preference._id
                                        );

                                  field.onChange(newValue);
                                };

                                return (
                                  <Checkbox
                                    id={preference._id}
                                    checked={isChecked}
                                    onCheckedChange={handleChange}
                                  />
                                );
                              }}
                            />
                            <Label
                              htmlFor={preference._id}
                              className="font-normal"
                            >
                              {preference.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>Failed to fetch preferences</p>
                    )}
                    {profileForm.formState.errors.preferences && (
                      <p className="text-sm text-red-500">
                        {profileForm.formState.errors.preferences.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-primary border text-primary-foreground rounded-lg hover:bg-primary/90"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "articles" &&
            (isArticleEditing && selectedArticle ? (
              <EditArticle onCancel={handleCancelEditArticle} preferences={preferences} article={selectedArticle} />
            ) : (
              <div className="px-2">
                <h2 className="text-2xl font-bold mb-6">My Articles</h2>

                {articles && articles.length > 0 ? (
                  <div className="space-y-8">
                    {articles.map((article, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col md:flex-row gap-6 pb-8 border-b border-gray-100 last:border-b-0"
                      >
                        {article.featureImage && (
                          <div className="md:w-1/3">
                            <img
                              src={article.featureImage}
                              alt={article.title}
                              className="w-full aspect-video object-cover rounded-lg shadow-sm"
                            />
                          </div>
                        )}
                        <div
                          className={
                            article.featureImage ? "md:w-2/3" : "w-full"
                          }
                        >
                          <h3 className="text-xl font-bold mb-2 hover:text-primary cursor-pointer">
                            {article.title}
                          </h3>
                          <p className="text-muted-foreground mb-4 line-clamp-2">
                            {article.subtitle}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                              {formatDate(article.createdAt)} ·{" "}
                              {article.readTime}
                            </div>
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleEditArticle(article)}
                               className="px-4 py-2 text-sm bg-secondary/30 rounded-lg hover:bg-secondary/50">
                                Edit
                              </button>
                              <button className="px-4 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-secondary/10 rounded-xl">
                    <p className="text-lg text-muted-foreground mb-4">
                      You haven't published any articles yet.
                    </p>
                    <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                      Write Your First Article
                    </button>
                  </div>
                )}
              </div>
            ))}

          {/* Saved Articles */}
          {activeTab === "saved" && (
            <div className="px-2">
              <h2 className="text-2xl font-bold mb-6">Saved Articles</h2>

              {savedArticles && savedArticles.length > 0 ? (
                <div className="space-y-8">
                  {savedArticles.map((article, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col md:flex-row gap-6 pb-8 border-b border-gray-100 last:border-b-0"
                    >
                      {article.featureImage && (
                        <div className="md:w-1/3">
                          <img
                            src={article.featureImage}
                            alt={article.title}
                            className="w-full aspect-video object-cover rounded-lg shadow-sm"
                          />
                        </div>
                      )}
                      <div
                        className={article.featureImage ? "md:w-2/3" : "w-full"}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
                                {article.author?.profilePicture ? (
                                  <img
                                    src={article.author.profilePicture}
                                    alt="Author"
                                    className="h-full w-full rounded-full object-cover"
                                  />
                                ) : (
                                  <span className="text-gray-600 text-xs">
                                    {article.author?.firstName?.[0]}
                                    {article.author?.lastName?.[0]}
                                  </span>
                                )}
                              </div>
                              <span className="text-sm">
                                {article.author?.firstName}{" "}
                                {article.author?.lastName}
                              </span>
                            </div>
                            <h3 className="text-xl font-bold mb-2 hover:text-primary cursor-pointer">
                              {article.title}
                            </h3>
                          </div>
                          <button className="text-primary hover:text-primary/80">
                            <Bookmark className="h-5 w-5 fill-current" />
                          </button>
                        </div>
                        <p className="text-muted-foreground mb-3 line-clamp-2">
                          {article.subtitle}
                        </p>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(article.createdAt)} · {article.readTime}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-secondary/10 rounded-xl">
                  <p className="text-lg text-muted-foreground mb-4">
                    You haven't saved any articles yet.
                  </p>
                  <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                    Explore Articles
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "security" && (
            <div className="px-2">
              <h2 className="text-2xl font-bold mb-6">Password & Security</h2>

              {passwordUpdated && (
                <div className="mb-6 p-3 bg-green-50 rounded-lg flex items-center text-green-700">
                  <Check className="h-5 w-5 mr-2" />
                  Password updated successfully!
                </div>
              )}

              <form onSubmit={passwordForm.handleSubmit(handlePasswordUpdate)}>
                <div className="space-y-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <Controller
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <input
                            type={showPassword ? "text" : "password"}
                            className="w-full p-3 bg-secondary/20 border-b focus:outline-none focus:ring-2 focus:ring-primary/20 pr-10"
                            {...field}
                          />
                        )}
                      />

                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 px-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                      {passwordForm.formState.errors.currentPassword && (
                        <p className="text-sm text-red-500">
                          {
                            passwordForm.formState.errors.currentPassword
                              .message
                          }
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Controller
                        control={passwordForm.control}
                        name="password"
                        render={({ field }) => (
                          <input
                            type={showPassword ? "text" : "password"}
                            className="w-full p-3 bg-secondary/20 border-b focus:outline-none focus:ring-2 focus:ring-primary/20 pr-10"
                            {...field}
                          />
                        )}
                      />

                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 px-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                      {passwordForm.formState.errors.currentPassword && (
                        <p className="text-sm text-red-500">
                          {
                            passwordForm.formState.errors.currentPassword
                              .message
                          }
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Controller
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <input
                            type="password"
                            className="w-full p-3 bg-secondary/20 border-b focus:outline-none focus:ring-2 focus:ring-primary/20 pr-10"
                            {...field}
                          />
                        )}
                      />
                      {passwordForm.formState.errors.confirmPassword && (
                        <p className="text-sm text-red-500">
                          {
                            passwordForm.formState.errors.confirmPassword
                              .message
                          }
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* <div className="mb-8 bg-secondary/10 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-3">
                    Password Requirements
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      At least 8 characters
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      Include at least one uppercase letter
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      Include at least one number
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      Include at least one special character
                    </li>
                  </ul>
                </div> */}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 border py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
