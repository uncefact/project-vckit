import {
  BaseEntity,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('bitstring-status-list')
@Unique('unique_bitstringLength_statusListVCIssuer_statusSize_statusMessages', [
  'bitstringLength',
  'statusListVCIssuer',
  'statusPurpose',
  'statusSize',
  'statusMessages',
])
@Unique('unique_statusListCredential_statusListVCIssuer', [
  'statusListCredential',
  'statusListVCIssuer',
  'statusPurpose',
])
export class BitstringStatusListEntry extends BaseEntity {
  @PrimaryGeneratedColumn()
  listIndex!: number;

  @Column({ default: 0 })
  lastStatusIndex!: number;

  @Column({ default: 131072 })
  bitstringLength!: number;

  @Column()
  statusListVCIssuer!: string;

  @Column()
  statusPurpose!: string;

  @Column({ default: 1 })
  statusSize!: number;

  @Column({ nullable: true })
  statusListCredential?: string;

  @Column({ nullable: true })
  verifiableCredential?: string;

  @Column({ default: '[{"status":0},{"status":1}]' })
  statusMessages!: string;

  @Column({ nullable: true })
  statusReference?: string;
}
