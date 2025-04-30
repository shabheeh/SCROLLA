export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dob: Date;
  preferences: string[];
  profilePicture?: string;
  createdAt: Date;
}

export type UpdateUser = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dob: Date;
  preferences: string[];
  profilePicture?: string;
};
