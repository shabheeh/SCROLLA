import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";

import { X } from "lucide-react";
import { signInFormSchema, SignInFormValues, signUpFormSchema, SignUpFormValues } from "../../validators/signup.validator";


// Define types for our article preferences
interface ArticlePreference {
  id: string;
  label: string;
}

// Article preferences options
const articlePreferences: ArticlePreference[] = [
  { id: "technology", label: "Technology" },
  { id: "business", label: "Business" },
  { id: "science", label: "Science" },
  { id: "sports", label: "Sports" },
  { id: "entertainment", label: "Entertainment" },
  { id: "health", label: "Health & Wellness" },
  { id: "politics", label: "Politics" },
  { id: "lifestyle", label: "Lifestyle" },
];

// Define the sign-up form schema with Zod


// Define props for the AuthModal component
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "sign-in" | "sign-up";
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = "sign-in",
}) => {
  const [activeView, setActiveView] = useState<"sign-in" | "sign-up">(
    defaultTab
  );


  // Sign up form
  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      preferences: [],
    },
  });

  // Sign in form
  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSignUpSubmit = async (data: SignUpFormValues) => {
    console.log("Sign up form submitted:", data);
    // Here you would typically send the data to your API
    // await apiClient.createUser(data);
    onClose();
  };

  const onSignInSubmit = async (data: SignInFormValues) => {
    console.log("Sign in form submitted:", data);
    // Here you would typically send the data to your API
    // await apiClient.signIn(data);
    onClose();
  };

  // Handle preference changes
  const handlePreferenceChange = (id: string, checked: boolean) => {
    const currentPreferences = signUpForm.watch("preferences") || [];

    if (checked) {
      signUpForm.setValue("preferences", [...currentPreferences, id]);
    } else {
      signUpForm.setValue(
        "preferences",
        currentPreferences.filter((pref) => pref !== id)
      );
    }
  };

  // Handle outside click to close modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // If the modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg">
        <div className="w-full flex justify-end">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <Card className="w-xl mx-auto border-0 shadow-none">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold">
                {activeView === "sign-up" ? "Create an Account" : "Sign In"}
              </CardTitle>
            </div>
            <CardDescription>
              {activeView === "sign-up"
                ? "Sign up to access personalized articles and more."
                : "Sign in to your account to continue."}
            </CardDescription>
          </CardHeader>

          {/* Sign In View */}
          {activeView === "sign-in" && (
            <form onSubmit={signInForm.handleSubmit(onSignInSubmit)}>
              <CardContent className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="signInEmail">Email</Label>
                  <Input
                    id="signInEmail"
                    type="email"
                    {...signInForm.register("email")}
                  />
                  {signInForm.formState.errors.email && (
                    <p className="text-sm text-red-500">
                      {signInForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="signInPassword">Password</Label>
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 h-auto text-sm"
                      type="button"
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <Input
                    id="signInPassword"
                    type="password"
                    {...signInForm.register("password")}
                  />
                  {signInForm.formState.errors.password && (
                    <p className="text-sm text-red-500">
                      {signInForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    {...signInForm.register("rememberMe")}
                  />
                  <Label htmlFor="rememberMe" className="font-normal">
                    Remember me
                  </Label>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-center gap-4 py-6">
                <Button
                  type="submit"
                  className="w-full bg-black text-white hover:bg-black hover:text-white"
                  disabled={signInForm.formState.isSubmitting}
                >
                  {signInForm.formState.isSubmitting
                    ? "Signing in..."
                    : "Sign In"}
                </Button>
                <p className="text-sm text-center">
                  Don't have an account?{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => setActiveView("sign-up")}
                  >
                    Create an account
                  </Button>
                </p>
              </CardFooter>
            </form>
          )}

          {/* Sign Up View */}
          {activeView === "sign-up" && (
            <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)}>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      {...signUpForm.register("firstName")}
                    />
                    {signUpForm.formState.errors.firstName && (
                      <p className="text-sm text-red-500">
                        {signUpForm.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" {...signUpForm.register("lastName")} />
                    {signUpForm.formState.errors.lastName && (
                      <p className="text-sm text-red-500">
                        {signUpForm.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...signUpForm.register("phone")}
                    />
                    {signUpForm.formState.errors.phone && (
                      <p className="text-sm text-red-500">
                        {signUpForm.formState.errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...signUpForm.register("email")}
                    />
                    {signUpForm.formState.errors.email && (
                      <p className="text-sm text-red-500">
                        {signUpForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input 
                    id="dob" 
                    type="date" 
                    max={new Date().toISOString().split('T')[0]}
                    onChange={(e) => {
                      if (e.target.value) {
                        signUpForm.setValue("dob", new Date(e.target.value));
                      }
                    }}
                  />
                  {signUpForm.formState.errors.dob && (
                    <p className="text-sm text-red-500">
                      {signUpForm.formState.errors.dob.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    {...signUpForm.register("password")}
                  />
                  {signUpForm.formState.errors.password && (
                    <p className="text-sm text-red-500">
                      {signUpForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...signUpForm.register("confirmPassword")}
                  />
                  {signUpForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {signUpForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label>Article Preferences</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {articlePreferences.map((preference) => (
                      <div
                        key={preference.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={preference.id}
                          onCheckedChange={(
                            checked: boolean | "indeterminate"
                          ) => {
                            handlePreferenceChange(
                              preference.id,
                              checked === true
                            );
                          }}
                        />
                        <Label htmlFor={preference.id} className="font-normal">
                          {preference.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {signUpForm.formState.errors.preferences && (
                    <p className="text-sm text-red-500">
                      {signUpForm.formState.errors.preferences.message}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-center gap-4 py-6">
                <Button
                  type="submit"
                  className="w-full bg-black text-white hover:bg-black hover:text-white"
                  disabled={signUpForm.formState.isSubmitting}
                >
                  {signUpForm.formState.isSubmitting
                    ? "Signing up..."
                    : "Sign Up"}
                </Button>
                <p className="text-sm text-center">
                  Already have an account?{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => setActiveView("sign-in")}
                  >
                    Sign in
                  </Button>
                </p>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AuthModal;
