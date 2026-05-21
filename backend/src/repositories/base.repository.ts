import { prisma } from '../services/prisma';
import type { PrismaClient } from '@prisma/client';

export class BaseRepository<Delegate extends { findUnique: any; findMany: any; create: any; update: any; delete: any }> {
  constructor(protected delegate: Delegate) {}

  async findById(id: string) {
    return (this.delegate as any).findUnique({ where: { id } });
  }

  async findMany(params?: { where?: any; orderBy?: any; include?: any; skip?: number; take?: number }) {
    return (this.delegate as any).findMany(params || {});
  }

  async create(data: any) {
    return (this.delegate as any).create({ data });
  }

  async update(id: string, data: any) {
    return (this.delegate as any).update({ where: { id }, data });
  }

  async delete(id: string) {
    return (this.delegate as any).delete({ where: { id } });
  }

  async count(where?: any) {
    return (this.delegate as any).count({ where });
  }
}
