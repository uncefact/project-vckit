import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('bitstring-status-data')
export class BitstringStatusData extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  bitstringStatusListUrlPath!: string;

  @Column()
  bitstringStatusListVCIssuer!: string;

  @Column({ default: 0 })
  listCounter!: number;

  @Column({ default: 0 })
  indexCounter!: number;

  @Column({ default: 8 })
  bitstringLength!: number;
}

@Entity('bitstring-status-list')
export class BitstringStatusListEntry extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  bitstringStatusListFullUrlPath!: string;

  @Column()
  bitstringStatusListVCIssuer!: string;

  @Column()
  verifiableCredential!: string;
}
