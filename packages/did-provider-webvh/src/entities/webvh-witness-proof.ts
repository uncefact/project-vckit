import { Column, Entity, PrimaryColumn } from 'typeorm';

/**
 * Witness proofs have a separate publication lifetime from DID logs. Proofs for
 * the next entry must be available before that entry becomes publicly readable.
 * @public
 */
@Entity('webvh-witness-proof')
export class WebvhWitnessProof {
  @PrimaryColumn()
  scid!: string;

  /** All publication locations, including a proposed portability destination. */
  @Column({ type: 'text', default: '[]' })
  dids!: string;

  /** Published and pending proof sets. Unknown version IDs are ignored by resolvers. */
  @Column({ type: 'text', default: '[]' })
  proofs!: string;
}
