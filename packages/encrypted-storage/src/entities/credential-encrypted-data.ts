import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('credential-encrypted-data')
export class CredentialEncryptedData extends BaseEntity {
  @PrimaryColumn()
  credentialHash!: string;

  @Column()
  encryptedDataId!: string;

  @Column()
  decryptedKey!: string;
}
