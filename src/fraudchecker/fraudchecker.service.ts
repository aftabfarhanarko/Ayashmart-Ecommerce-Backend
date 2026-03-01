import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFraudcheckerDto } from './dto/create-fraudchecker.dto';
import { UpdateFraudcheckerDto } from './dto/update-fraudchecker.dto';
import { UsersService } from '../users/users.service';
import { RequestContextService } from '../common/services/request-context.service';

@Injectable()
export class FraudcheckerService {

  constructor(
    private readonly usersService: UsersService,
    private readonly requestContextService: RequestContextService,
  ) {}

  // Base risk evaluation by user id
  async checkUserRisk(userId: number) {
    const companyId = this.requestContextService.getCompanyId();
    const user = await this.usersService.findOne(userId, companyId);

    const reasons: string[] = [];
    let score = 0;

    if (user.isBanned) {
      reasons.push('User is banned');
      score = 100;
    } else {
      const successful = user.successfulOrdersCount ?? 0;
      const cancelled = user.cancelledOrdersCount ?? 0;
      const total = successful + cancelled;
      const cancelRate = total > 0 ? cancelled / total : 0;

      if (cancelRate >= 0.5) {
        reasons.push('High cancellation rate (>= 50%)');
        score += 70;
      } else if (cancelRate >= 0.2) {
        reasons.push('Elevated cancellation rate (>= 20%)');
        score += 40;
      }

      if (successful === 0 && cancelled > 0) {
        reasons.push('Only cancellations, no successful orders');
        score += 30;
      }

      if (score > 100) score = 100;
    }

    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone ?? null,
      isBanned: user.isBanned,
      riskScore: score,
      riskReasons: reasons,
    };
  }

  // New: risk evaluation by phone number
  async checkUserRiskByPhone(phone: string) {
    const companyId = this.requestContextService.getCompanyId();
    const user = await this.usersService.findByPhone(phone, companyId);
    return this.checkUserRisk(user.id);
  }

  async checkUserRiskByEmail(email: string) {
    const companyId = this.requestContextService.getCompanyId();
    const user = await this.usersService.findByEmail(email, companyId);
    return this.checkUserRisk(user.id);
  }

  async checkUserRiskByName(name: string) {
    const companyId = this.requestContextService.getCompanyId();
    const users = await this.usersService.findByName(name, companyId);
    if (!users.length) throw new NotFoundException('No users found with that name');
    const results = await Promise.all(users.map((u) => this.checkUserRisk(u.id)));
    return { count: results.length, results };
  }

  async flagUser(userId: number, reason?: string) {
    const companyId = this.requestContextService.getCompanyId();
    return this.usersService.ban(userId, companyId, reason);
  }

  async unflagUser(userId: number) {
    const companyId = this.requestContextService.getCompanyId();
    return this.usersService.unban(userId, companyId);
  }
}
