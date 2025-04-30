import { model, Schema } from "mongoose";
import { IPreference } from "../interfaces/preferences.interface";

const preferenceSchema = new Schema<IPreference>({
  name: {
    type: String,
    required: true,
  },
});

export const PreferenceModel = model<IPreference>(
  "Preference",
  preferenceSchema
);
