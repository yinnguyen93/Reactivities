export interface IUser {
  username: string;
  displayName: string;
  token: string;
  image?: string;
}

export interface IUserFormValues {
  email: string;
  password: string;
  diplayName?: string;
  username?: string;
}
