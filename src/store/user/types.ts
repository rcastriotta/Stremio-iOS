export interface IUser {
  _id: string;
  email: string;
  fbId: string;
  fullname: string;
  avatar: string;
  anonymous: boolean;
  gdpr_consent: {
    marketing: boolean;
    privacy: boolean;
    tos: boolean;
    from: string;
  };
  taste: null;
  lang: string;
  dateRegistered: string;
  lastModified: string;
  trakt?: {
    created_at: number;
    expires_in: number;
    access_token: string;
    refresh_token: string;
  };
  stremio_addons: string;
  premium_expire: string;
}

export interface ILoginSuccess {
  user: IUser;
  token: string;
}

export interface IUserState {
  loggedIn: boolean;
  user?: IUser;
  token: string | null;
  streamingURL: string;
}
