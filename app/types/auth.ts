export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}

export interface JwtPayload {
  username: string;
  email: string;
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
