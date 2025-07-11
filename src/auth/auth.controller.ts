import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

/**
 * Authentication Controller Class
 * Handles all authentication-related HTTP requests
 */
export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RegisterRequest'
   *     responses:
   *       201:
   *         description: User registered successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse'
   *       400:
   *         description: Bad request - validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       409:
   *         description: Conflict - user already exists
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  public register = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const authResponse = await this.authService.register(req.body);
    res.status(201).json(authResponse);
  };

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: Login user
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginRequest'
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse'
   *       401:
   *         description: Unauthorized - invalid credentials
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       400:
   *         description: Bad request - validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  public login = async (req: Request, res: Response, _next: NextFunction) => {
    const authResponse = await this.authService.login(req.body);
    res.status(200).json(authResponse);
  };

  /**
   * @swagger
   * /api/auth/current-user:
   *   get:
   *     summary: Get current user information
   *     tags: [Authentication]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Current user information retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   $ref: '#/components/schemas/User'
   *       401:
   *         description: Unauthorized - invalid or missing token
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  public currentUser = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    // req.user should be set by auth middleware
    res.status(200).json({ user: req.currentUser });
  };

  /**
   * @swagger
   * /api/auth/refresh:
   *   post:
   *     summary: Refresh access token
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RefreshRequest'
   *     responses:
   *       200:
   *         description: Token refreshed successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse'
   *       401:
   *         description: Unauthorized - invalid refresh token
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       400:
   *         description: Bad request - validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  public refresh = async (req: Request, res: Response, _next: NextFunction) => {
    const tokens = await this.authService.refresh(req.body);
    res.status(200).json(tokens);
  };

  /**
   * @swagger
   * /api/auth/private:
   *   get:
   *     summary: Access private route (requires authentication)
   *     tags: [Authentication]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Access granted to private route
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Access granted to private route"
   *                 user:
   *                   $ref: '#/components/schemas/User'
   *       401:
   *         description: Unauthorized - invalid or missing token
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  public privateRoute = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    res.status(200).json({
      message: 'Access granted to private route',
      user: req.currentUser,
    });
  };
}

// Export a singleton instance
export const authController = new AuthController();
