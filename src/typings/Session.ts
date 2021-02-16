export interface User extends BasePersona {
  email: string;
  token: string;
  remember: string;
}

export interface UserCredentials {
  email: string;
  password: string;
  remember?: boolean;
}
