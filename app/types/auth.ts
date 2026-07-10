export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
  avatar: string | null
  created_at: Date;
  updated_at: Date;
}

export interface JwtPayload {
  id: number;
  role: string;
  iat?: number;
  exp?: number;
}

export interface RegisterRequestBody {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequestBody {
  username: string;
  password: string;
}
