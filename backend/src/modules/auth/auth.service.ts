import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../services/prisma';
import { config } from '../../config';
import { AppError } from '../../common/errors';
import type { LoginInput, RegisterInput } from '@chatmbl/shared';

export class AuthService {
  async register(data: RegisterInput) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new AppError(409, 'Email already registered');
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const org = await prisma.organization.create({
      data: {
        name: data.organizationName,
        slug: data.organizationName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      },
    });

    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash,
        role: 'owner',
        organizationId: org.id,
      },
    });

    const tokens = this.generateTokens(user.id, org.id, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organizationId: org.id,
      },
      tokens,
    };
  }

  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      throw new AppError(401, 'Invalid email or password');
    }

    const valid = await bcrypt.compare(data.password, user.passwordHash);
    if (!valid) {
      throw new AppError(401, 'Invalid email or password');
    }

    const tokens = this.generateTokens(user.id, user.organizationId, user.role);

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        role: user.role,
        organizationId: user.organizationId,
      },
      tokens,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, config.jwt.secret) as {
        userId: string;
        organizationId: string;
        role: string;
      };
      const tokens = this.generateTokens(decoded.userId, decoded.organizationId, decoded.role);
      return { tokens };
    } catch {
      throw new AppError(401, 'Invalid refresh token');
    }
  }

  private generateTokens(userId: string, organizationId: string, role: string) {
    const accessToken = jwt.sign(
      { userId, organizationId, role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn as any },
    );

    const refreshToken = jwt.sign(
      { userId, organizationId, role },
      config.jwt.secret,
      { expiresIn: '30d' as any },
    );

    return {
      accessToken,
      refreshToken,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };
  }
}
