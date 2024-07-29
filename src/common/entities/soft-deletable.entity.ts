import { BaseEntity } from './base.entity';
import { DeleteDateColumn } from 'typeorm';

export abstract class SoftDeletableEntity extends BaseEntity {
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;
}
