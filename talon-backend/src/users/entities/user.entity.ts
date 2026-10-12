import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '@common/enums/role.enum';
import { Theme } from '@common/enums/theme.enum';

@Entity('users')
@Index(['email'], { unique: true })
@Index(['deletedAt'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 254, unique: true })
  email!: string;

  @Column({ name: 'password_hash', type: 'varchar', select: false })
  passwordHash!: string;

  @Column({ name: 'first_name', type: 'varchar', length: 50, nullable: true })
  firstName!: string | null;

  @Column({ name: 'last_name', type: 'varchar', length: 50, nullable: true })
  lastName!: string | null;

  @Column({ type: 'varchar', length: 50, default: 'UTC' })
  timezone!: string;

  @Column({
    type: 'enum',
    enum: Theme,
    default: Theme.SYSTEM,
  })
  theme!: Theme;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role!: Role;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ name: 'is_verified', type: 'boolean', default: false })
  isVerified!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz' })
  deletedAt!: Date | null;
}
