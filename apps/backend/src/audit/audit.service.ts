import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}
  async log(input: { actorId?: string; action: string; entityType: string; entityId: string; before?: unknown; after?: unknown; ip?: string; userAgent?: string; }) {
    return this.prisma.auditLog.create({ data: input });
  }
}
