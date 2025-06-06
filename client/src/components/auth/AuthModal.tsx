import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
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

import { Eye, EyeOff, X } from "lucide-react";
import {
  signInFormSchema,
  SignInFormValues,
  signUpFormSchema,
  SignUpFormValues,
} from "../../validators/signup.validator";
import { toast } from "sonner";
import {
  IUserSignupInput,
  userSignin,
  userSignup,
} from "../../services/auth.service";
import { useAuth } from "../../contexts/authContext";
import { getArticlePrefernces } from "../../services/article.service";
import { IPreference } from "../../types/preference.types";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import OtpForm from "./OtpForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab: "sign-in" | "sign-up";
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab,
}) => {
  const [activeView, setActiveView] = useState<"sign-in" | "sign-up" | "otp">(
    defaultTab
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [preferences, setPreferences] = useState<IPreference[]>([]);
  const [email, setEmail] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

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

  const { signin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setActiveView(defaultTab);
  }, [defaultTab]);

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

  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });
  const onSignUpSubmit = async (data: SignUpFormValues) => {
    const userData: IUserSignupInput = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      password: data.password,
      dob: data.dob,
      preferences: data.preferences,
    };
    try {
      const result = await userSignup(userData);
      setEmail(result);
      toast.success("Otp sent to your email");
      setActiveView("otp");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  const onSignInSubmit = async (data: SignInFormValues) => {
    try {
      const result = await userSignin(data.email, data.password);
      signin(result.user, result.token);
      toast.success("User Signed in Successfully");
      onClose();
      navigate("/feed");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg">
        <div className="w-full flex justify-end">
          <Button
            className="cursor-pointer"
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
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

          {activeView === "sign-in" && (
            <form onSubmit={signInForm.handleSubmit(onSignInSubmit)}>
              <CardContent className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="signInEmail">Email</Label>
                  <Controller
                    control={signInForm.control}
                    name="email"
                    render={({ field }) => (
                      <Input
                        id="signInEmail"
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                      />
                    )}
                  />
                  {signInForm.formState.errors.email && (
                    <p className="text-sm text-red-500">
                      {signInForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signInPassword">Password</Label>
                  <Controller
                    control={signInForm.control}
                    name="password"
                    render={({ field }) => (
                      <Input
                        id="signInPassword"
                        type="password"
                        {...signInForm.register("password")}
                        placeholder="Enter your password"
                        {...field}
                      />
                    )}
                  />

                  {signInForm.formState.errors.password && (
                    <p className="text-sm text-red-500">
                      {signInForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-center gap-4 py-6">
                <Button
                  type="submit"
                  className="w-full bg-black text-white hover:bg-black hover:text-white cursor-pointer"
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
                    className="p-0 h-auto cursor-pointer"
                    onClick={() => setActiveView("sign-up")}
                  >
                    Create an account
                  </Button>
                </p>
              </CardFooter>
            </form>
          )}
          {activeView === "sign-up" && (
            <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)}>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Controller
                      control={signUpForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <Input
                          id="firstName"
                          type="text"
                          {...signUpForm.register("firstName")}
                          {...field}
                        />
                      )}
                    />
                    {signUpForm.formState.errors.firstName && (
                      <p className="text-sm text-red-500">
                        {signUpForm.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Controller
                      control={signUpForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <Input
                          id="lastName"
                          type="text"
                          {...signUpForm.register("lastName")}
                          {...field}
                        />
                      )}
                    />
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
                    <Controller
                      control={signUpForm.control}
                      name="phone"
                      render={({ field }) => (
                        <Input
                          id="phone"
                          type="tel"
                          {...signUpForm.register("phone")}
                          {...field}
                        />
                      )}
                    />
                    {signUpForm.formState.errors.phone && (
                      <p className="text-sm text-red-500">
                        {signUpForm.formState.errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Controller
                      control={signUpForm.control}
                      name="email"
                      render={({ field }) => (
                        <Input
                          id="email"
                          type="email"
                          {...signUpForm.register("email")}
                          {...field}
                        />
                      )}
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
                  <Controller
                    control={signUpForm.control}
                    name="dob"
                    render={({ field }) => (
                      <Input
                        id="dob"
                        type="date"
                        max={new Date().toISOString().split("T")[0]}
                        value={
                          field.value
                            ? new Date(field.value).toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) => {
                          const dateValue = e.target.value
                            ? new Date(e.target.value)
                            : null;
                          field.onChange(dateValue);
                        }}
                      />
                    )}
                  />

                  {signUpForm.formState.errors.dob && (
                    <p className="text-sm text-red-500">
                      {signUpForm.formState.errors.dob.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Controller
                    control={signUpForm.control}
                    name="password"
                    render={({ field }) => (
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          {...signUpForm.register("password", {
                            required: "Password is required",
                          })}
                          {...field}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-600 focus:outline-none"
                        >
                          {showPassword ? (
                            <Eye />
                          ) : (
                            <EyeOff />
                          )}
                        </Button>
                      </div>
                    )}
                  />

                  {signUpForm.formState.errors.password && (
                    <p className="text-sm text-red-500">
                      {signUpForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Controller
                    control={signUpForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <Input
                        id="confirmPassword"
                        type="password"
                        {...signUpForm.register("confirmPassword")}
                        {...field}
                      />
                    )}
                  />

                  {signUpForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {signUpForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label>Article Preferences</Label>
                  {loading && <LoadingSpinner />}
                  {preferences.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {preferences.map((preference) => (
                        <div
                          key={preference._id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={preference._id}
                            onCheckedChange={(
                              checked: boolean | "indeterminate"
                            ) => {
                              handlePreferenceChange(
                                preference._id,
                                checked === true
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
                  className="w-full bg-black text-white hover:bg-black hover:text-white cursor-pointer"
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
                    className="p-0 h-auto cursor-pointer"
                    onClick={() => setActiveView("sign-in")}
                  >
                    Sign in
                  </Button>
                </p>
              </CardFooter>
            </form>
          )}
          {activeView === "otp" && email && (
            <OtpForm
              email={email}
              onConfirm={() => setActiveView("sign-in")}
              onClose={onClose}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default AuthModal;
