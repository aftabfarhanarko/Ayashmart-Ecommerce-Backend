import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemUser } from '../../systemuser/entities/systemuser.entity';

@Injectable()
export class CompanyIdService {
  constructor(
    @InjectRepository(SystemUser)
    private readonly systemUserRepo: Repository<SystemUser>,
  ) {}

  /**
   * Generates the next companyId in the format COMP-000001, COMP-000002, etc.
   * Fetches the last created companyId and increments the numeric part.
   */
  async generateNextCompanyId(): Promise<string> {
    // Find the last created system user with a companyId
    const lastUser = await this.systemUserRepo
      .createQueryBuilder('user')
      .where('user.companyId IS NOT NULL')
      .andWhere('user.companyId LIKE :pattern', { pattern: 'COMP-%' })
      .orderBy('user.id', 'DESC')
      .getOne();

    let nextNumber = 1;

    if (lastUser && lastUser.companyId) {
      // Extract the numeric part from the last companyId
      const match = lastUser.companyId.match(/COMP-(\d+)/);
      if (match && match[1]) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }

    // Format as COMP-000001, COMP-000002, etc. (6 digits)
    return `COMP-${nextNumber.toString().padStart(6, '0')}`;
  }
}


