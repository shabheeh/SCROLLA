import { IUser } from "../types/user.types";
import api from "../utils/axios.interceptor";

export interface IUserSignupInput extends IUser {
  password: string;
}

type SigninResult = {
  success: boolean;
  message: string;
  user: IUser;
  token: string;
};

export const userSignup = async (userData: IUserSignupInput): Promise<void> => {
  try {
    console.log(userData)
    await api.post("/signup", userData);
  } catch (error) {
    console.log(error)
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      console.log(error);
      throw new Error("Something went wrong")
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
