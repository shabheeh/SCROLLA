import { AxiosError } from "axios";
import { User } from "../types/user.types";
import api from "../utils/axios.interceptor";

export const userSignup = async(userData: User): Promise<void> => {
    try {
        await api.post('/singin', userData);
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.message)
        }else {
            console.log(error)
        }
    }
}