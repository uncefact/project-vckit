import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryColumn,
} from 'typeorm';

/**
 * TypeORM entity for storing did:webvh DID logs.
 *
 * Keyed by SCID (Self-Certifying Identifier) rather than the DID string,
 * because the DID string changes when a DID is ported to a new domain,
 * but the SCID is permanent.
 *
 * @public
 */
@Entity('webvh-did-log')
export class WebvhDidLog extends BaseEntity {
  /**
   * The Self-Certifying Identifier — derived from the hash of the genesis log entry.
   * This is permanent and never changes, even across domain migrations.
   */
  @PrimaryColumn()
  scid!: string;

  /**
   * The current DID string (e.g. 'did:webvh:z6Mkh...:example.com').
   * Updated when the DID is ported to a new domain.
   */
  @Column()
  currentDid!: string;

  /**
   * JSON-serialized array of previous DID strings.
   * Populated when the DID is ported to a new domain.
   */
  @Column({ type: 'text', default: '[]' })
  previousDids!: string;

  /**
   * The full DID log as a JSON-serialized DIDLog array.
   * Each entry in the log is a DIDLogEntry with versionId, versionTime,
   * parameters, state (DID document), and proof.
   */
  @Column('text')
  log!: string;

  /**
   * Whether the DID was created with portable: true.
   */
  @Column({ default: true })
  portable!: boolean;

  /**
   * Whether the DID has been deactivated.
   */
  @Column({ default: false })
  deactivated!: boolean;

  @BeforeInsert()
  setSaveDate() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  setUpdateDate() {
    this.updatedAt = new Date();
  }

  @Column({ select: false })
  // @ts-ignore
  createdAt: Date;

  @Column({ select: false })
  // @ts-ignore
  updatedAt: Date;
}
