// @ts-ignore
import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async register(email: string, pass: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(pass, 10);
    return this.prisma.user.create({
      data: { email, password: hashedPassword },
    });
  }

  public async login(email: string, pass: string): Promise<string | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(pass, user.password))) return null;
    
    return jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
  }
}