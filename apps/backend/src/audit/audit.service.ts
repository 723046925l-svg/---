import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}
  log(data: { actorId?: string; role?: any; action: string; entity: string; entityId?: string; before?: any; after?: any; ip?: string; userAgent?: string }) {
    return this.prisma.auditLog.create({ data });
  }
}
