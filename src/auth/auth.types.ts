// Authentication types and interfaces

export interface UserRegistrationData {
  email: string;
  password: string;
}

export interface UserLoginData {
  email: string;
  password: string;
}

export interface RefreshTokenData {
  refreshToken: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserResponse {
  id: string;
  email: string;
}

export interface AuthResponse extends AuthTokens {
  user: UserResponse;
}

export interface UserPayload {
  id: string;
}

// JWT payload interface
export interface JWTPayload {
  id: string;
  iat?: number;
  exp?: number;
} 