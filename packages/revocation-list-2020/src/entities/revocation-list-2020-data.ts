import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity('revocation-data')
export class RevocationData extends BaseEntity {
  @PrimaryColumn()
  revocationListUrlPath!: string;

  @Column({ default: 0 })
  listCounter!: number;

  @Column({ default: 0 })
  indexCounter!: number;

  @Column({ default: 8 })
  bitStringLength!: number;
}

@Entity('revocation-list')
export class RevocationList extends BaseEntity {
  @PrimaryColumn()
  revocationListFullUrlPath!: string;

  @Column()
  verifiableCredential!: string;
}
