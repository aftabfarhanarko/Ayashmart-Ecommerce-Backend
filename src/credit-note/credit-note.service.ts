import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreditNote } from './entities/credit-note.entity';
import { CreateCreditNoteDto } from './dto/create-credit-note.dto';

@Injectable()
export class CreditNoteService {
  constructor(
    @InjectRepository(CreditNote)
    private readonly creditNoteRepository: Repository<CreditNote>,
  ) {}

  /**
   * Create a new Credit Note
   * @param createCreditNoteDto Data to create credit note
   * @returns Created credit note
   */
  async create(createCreditNoteDto: CreateCreditNoteDto): Promise<CreditNote> {
    const creditNote = this.creditNoteRepository.create(createCreditNoteDto);
    return await this.creditNoteRepository.save(creditNote);
  }

  /**
   * Find all Credit Notes for a specific company
   * @param companyId Company ID to filter by
   * @returns List of credit notes
   */
  async findAllByCompany(companyId: string): Promise<CreditNote[]> {
    return await this.creditNoteRepository.find({
      where: { companyId },
      relations: ['customer', 'relatedInvoice'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Find a single Credit Note by ID
   * @param id Credit Note ID
   * @param companyId Company ID for security check
   * @returns Credit Note entity
   */
  async findOne(id: number, companyId: string): Promise<CreditNote> {
    const creditNote = await this.creditNoteRepository.findOne({
      where: { id, companyId },
      relations: ['customer', 'relatedInvoice'],
    });

    if (!creditNote) {
      throw new NotFoundException(`Credit Note with ID ${id} not found`);
    }

    return creditNote;
  }

  /**
   * Remove a Credit Note (Soft Delete)
   * @param id Credit Note ID
   * @param companyId Company ID for security check
   */
  async remove(id: number, companyId: string): Promise<void> {
    const creditNote = await this.findOne(id, companyId);
    await this.creditNoteRepository.softRemove(creditNote);
  }
}
