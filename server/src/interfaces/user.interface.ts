import { Document, Types } from "mongoose";

export interface IUser extends Document {
  profilePicture: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  dob: Date;
  preferences: Types.ObjectId[];
}
