import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('encrypted-data')
export class EncryptedData extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  data!: string;

  @BeforeInsert()
  setSaveDate() {
    this.saveDate = new Date();
    this.updateDate = new Date();
  }

  @BeforeUpdate()
  setUpdateDate() {
    this.updateDate = new Date();
  }

  @Column({ select: false })
  // @ts-ignore
  saveDate: Date;

  @Column({ select: false })
  // @ts-ignore
  updateDate: Date;
}
