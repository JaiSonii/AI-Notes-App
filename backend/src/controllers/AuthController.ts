import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
  private authService = new AuthService();

  register = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await this.authService.register(email, password);
      res.json(user);
    } catch (e) {
      res.status(400).json({ error: 'User already exists or invalid data' });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const token = await this.authService.login(email, password);
      if (!token) return res.status(401).json({ error: 'Invalid credentials' });
      res.json({ token });
    } catch (e) {
      res.status(500).json({ error: 'Internal error' });
    }
  };
}