import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn, ManyToMany, JoinTable, Index } from 'typeorm';
import { Message } from './Message';
import { User } from './User';

export enum ChatType {
  DIRECT = 'direct',
  GROUP = 'group',
  CHANNEL = 'channel',
  BROADCAST = 'broadcast'
}

export enum ChatStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
  MUTED = 'muted'
}

@Entity('chats')
@Index(['type'])
@Index(['status'])
@Index(['createdAt'])
@Index(['updatedAt'])
@Index(['type', 'status'])
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ChatType,
    default: ChatType.DIRECT
  })
  type: ChatType;

  @Column({
    type: 'enum',
    enum: ChatStatus,
    default: ChatStatus.ACTIVE
  })
  status: ChatStatus;

  @Column({ type: 'simple-array' })
  participants: string[];

  @ManyToMany(() => User, user => user.chats)
  @JoinTable({
    name: 'chat_participants',
    joinColumn: {
      name: 'chatId',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'id'
    }
  })
  participantsList: User[];

  @Column({ nullable: true })
  createdBy?: string;

  @ManyToOne(() => User, user => user.createdChats)
  @JoinColumn({ name: 'createdBy' })
  createdByUser?: User;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'jsonb', nullable: true })
  settings?: any;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @Column({ nullable: true })
  lastMessageAt?: Date;

  @Column({ nullable: true })
  lastMessageId?: string;

  @ManyToOne(() => Message, message => message.chat)
  @JoinColumn({ name: 'lastMessageId' })
  lastMessage?: Message;

  @OneToMany(() => Message, message => message.chat)
  messages: Message[];

  @Column({ default: 0 })
  unreadCount: number;

  @Column({ type: 'simple-array', nullable: true })
  blockedUsers?: string[];

  @Column({ nullable: true })
  blockReason?: string;

  @Column({ default: false })
  blockMessages: boolean;

  @Column({ default: false })
  blockCalls: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  archivedAt?: Date;

  @Column({ nullable: true })
  deletedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}