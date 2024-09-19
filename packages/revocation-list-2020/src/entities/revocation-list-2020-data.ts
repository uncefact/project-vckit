import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('revocation-data')
export class RevocationData extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  revocationListUrlPath!: string;

  @Column()
  revocationVCIssuer!: string;

  @Column({ default: 0 })
  listCounter!: number;

  @Column({ default: 0 })
  indexCounter!: number;

  @Column({ default: 8 })
  bitStringLength!: number;
}

@Entity('revocation-list')
export class RevocationList extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  revocationListFullUrlPath!: string;

  @Column()
  revocationVCIssuer!: string;

  @Column()
  verifiableCredential!: string;
}
