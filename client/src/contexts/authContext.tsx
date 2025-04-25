import { createContext, useContext } from "react";
import { IUser } from "../types/user.types";

interface AuthContextType {
    user: IUser | null;
    token: string | null;
    signin: (userData: IUser, token: string) => void;
    signout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error("useAuth must use with in the authcontext provdier")
    }
    
    return context;
}

