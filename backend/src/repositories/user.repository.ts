import { prisma } from '../services/prisma';
import { BaseRepository } from './base.repository';

export class UserRepository extends BaseRepository<typeof prisma.user> {
  constructor() {
    super(prisma.user);
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findByOrganization(organizationId: string) {
    return prisma.user.findMany({ where: { organizationId } });
  }
}

export const userRepository = new UserRepository();
