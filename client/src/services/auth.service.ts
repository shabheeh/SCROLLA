import { IUser, UpdateUser } from "../types/user.types";
import api from "../utils/axios.interceptor";

export interface IUserSignupInput extends Omit<IUser, "_id" | "createdAt"> {
  password: string;
}

type SigninResult = {
  success: boolean;
  message: string;
  user: IUser;
  token: string;
};

export const userSignup = async (userData: IUserSignupInput): Promise<string> => {
  try {

   const response = await api.post("/signup", userData);
   return response.data.email
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      console.log(error);
      throw new Error("Something went wrong");
    }
  }
};

export const userSignin = async (
  email: string,
  password: string
): Promise<SigninResult> => {
  try {
    const response = await api.post("/signin", { email, password });

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

export const checkAuth = async (): Promise<IUser> => {
  try {
    const response = await api.get("/authenticate");
    return response.data.user;
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

export const signoutUser = async () => {
  try {
    await api.post("/signout");
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

export const updateProfile = async (userData: UpdateUser): Promise<IUser> => {
  try {
    const response = await api.put("/users", userData);
    return response.data.user;
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

export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  try {
    await api.patch("/users", { currentPassword, newPassword });
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

export const verfiyOtp = async (email: string, otp: string): Promise<void> => {
  try {
    await api.post("/verify-otp", { email, otp });
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

export const resendOtp = async (email: string): Promise<void> => {
  try {
    await api.post("/resend-otp", { email });
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
