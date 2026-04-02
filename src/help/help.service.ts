import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { CreateHelpDto } from './dto/create-help.dto';
import { UpdateHelpDto } from './dto/update-help.dto';
import { ReplyHelpDto } from './dto/reply-help.dto';
import { Help, SupportStatus } from './entities/help.entity';
import { HelpSupportGateway } from './help-support.gateway';

@Injectable()
export class HelpService {
  constructor(
    @InjectRepository(Help)
    private readonly helpRepo: Repository<Help>,
    @Inject('MAILER_TRANSPORT')
    private readonly mailer: { sendMail: (message: unknown) => Promise<{ id?: string }> },
    private readonly helpSupportGateway: HelpSupportGateway,
  ) { }

  async create(createHelpDto: CreateHelpDto, companyId?: string | undefined) {
    if (!companyId) {
      throw new NotFoundException('CompanyId is required');
    }
    const entity = this.helpRepo.create({
      email: createHelpDto.email,
      issue: createHelpDto.issue,
      status: createHelpDto.status ?? SupportStatus.PENDING,
      companyId: companyId,
      priority: createHelpDto.priority ?? 'medium',
      tags: Array.isArray(createHelpDto.tags) ? createHelpDto.tags : [],
      attachments: Array.isArray(createHelpDto.attachments) ? createHelpDto.attachments : [],
    });
    const saved = await this.helpRepo.save(entity);
    await this.sendSupportEmail(saved, createHelpDto.email);
    return saved;
  }

  async findAll(companyId?: string | undefined) {
    const where = companyId != null ? { companyId } : {};
    return this.helpRepo.find({
      where,
      order: { id: 'DESC' },
    });
  }

  async getStats(companyId?: string | undefined) {
    const baseWhere = companyId != null ? { companyId } : {};
    const [all, pending, inProgress, resolved] = await Promise.all([
      this.helpRepo.count({ where: baseWhere }),
      this.helpRepo.count({ where: { ...baseWhere, status: SupportStatus.PENDING } }),
      this.helpRepo.count({ where: { ...baseWhere, status: SupportStatus.IN_PROGRESS } }),
      this.helpRepo.count({ where: { ...baseWhere, status: SupportStatus.RESOLVED } }),
    ]);
    const active = pending + inProgress;
    return {
      total: all,
      pending,
      in_progress: inProgress,
      resolved,
      active,
    };
  }

  async findOne(id: number, companyId?: string | undefined) {
    const where = companyId != null ? { id, companyId } : { id };
    const entity = await this.helpRepo.findOne({ where });
    if (!entity) throw new NotFoundException(`Help ticket ${id} not found`);
    return entity;
  }

  async update(id: number, updateHelpDto: UpdateHelpDto, companyId?: string | undefined) {
    const entity = await this.findOne(id, companyId);
    const merged = this.helpRepo.merge(entity, updateHelpDto);
    if (companyId != null) merged.companyId = companyId;
    return this.helpRepo.save(merged);
  }

  async remove(id: number, companyId?: string | undefined) {
    const entity = await this.findOne(id, companyId);
    await this.helpRepo.softRemove(entity);
    return { success: true };
  }

  async addReply(id: number, replyDto: ReplyHelpDto, companyId?: string | undefined) {
    const entity = await this.findOne(id, companyId);
    const reply = {
      message: replyDto.message,
      author: replyDto.author,
      createdAt: new Date().toISOString(),
    };
    const replies = Array.isArray(entity.replies) ? [...entity.replies] : [];
    replies.push(reply);
    entity.replies = replies;
    const saved = await this.helpRepo.save(entity);
    try {
      this.helpSupportGateway.emitNewReply(id, reply);
    } catch (e) {
      console.error('Socket emit failed:', e);
    }
    return saved;
  }

  private async sendSupportEmail(help: Help, email: string) {
    try {
      const adminEmail = 'ashikurovi2003@gmail.com';
      await this.mailer.sendMail({
        companyId: help.companyId,
        from: email,
        to: adminEmail,
        subject: `New Support Issue from ${help.email}`,
        text: `Issue:\n${help.issue}\nStatus: ${help.status}\nTicket ID: ${help.id}`,
      });
    } catch (e) {
      console.error('Failed to send support email:', e);
    }
  }
}
