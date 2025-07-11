import { BadRequestError } from '../common/errors/bad-request';
import { UsersService } from '../users/users.service';
import {
  UserRegistrationData,
  UserLoginData,
  RefreshTokenData,
  AuthTokens,
  AuthResponse,
} from './auth.types';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from './auth.utils';

export class AuthService {
  constructor(private usersService: UsersService) {}

  private generateAuthTokens(userId: string): AuthTokens {
    return {
      accessToken: generateAccessToken(userId),
      refreshToken: generateRefreshToken(userId),
    };
  }

  async register(data: UserRegistrationData): Promise<AuthResponse> {
    // Use UsersService for user creation - it handles validation
    const user = await this.usersService.createUser({
      email: data.email,
      password: data.password,
    });

    const tokens = this.generateAuthTokens(user.id);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async login(data: UserLoginData): Promise<AuthResponse> {
    const user = await this.usersService.validateCredentials(
      data.email,
      data.password
    );
    const tokens = this.generateAuthTokens(user.id);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async refresh(data: RefreshTokenData): Promise<AuthTokens> {
    try {
      const payload = verifyToken(data.refreshToken);
      const accessToken = generateAccessToken(payload.id);
      const refreshToken = generateRefreshToken(payload.id);

      return { accessToken, refreshToken };
    } catch {
      throw new BadRequestError('Invalid refresh token');
    }
  }
}
