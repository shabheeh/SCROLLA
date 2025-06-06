import { Schema, model } from "mongoose";
import { IUser } from "../interfaces/user.interface";

const userSchema = new Schema<IUser>(
  {
    profilePicture: {
      type: String,
      optional: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    preferences: {
      type: [Schema.Types.ObjectId],
      ref: "Preference",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const userModel = model<IUser>("User", userSchema);
