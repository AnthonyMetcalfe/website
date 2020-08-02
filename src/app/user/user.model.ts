import { User } from "../models/user.model";

export interface UserStateModel {
  user: User;
  usernames: string[];
}
