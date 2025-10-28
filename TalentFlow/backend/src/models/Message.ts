import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Chat } from './Chat';
import { User } from './User';

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  VIDEO = 'video',
  AUDIO = 'audio',
  SYSTEM = 'system',
  CALL = 'call',
  LOCATION = 'location',
  CONTACT = 'contact'
}

export enum MessageStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
  PENDING = 'pending'
}

@Entity('messages')
@Index(['chatId'])
@Index(['senderId'])
@Index(['createdAt'])
@Index(['status'])
@Index(['type'])
@Index(['chatId', 'createdAt'])
@Index(['senderId', 'status'])
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  chatId: string;

  @ManyToOne(() => Chat, chat => chat.messages)
  @JoinColumn({ name: 'chatId' })
  chat: Chat;

  @Column()
  senderId: string;

  @ManyToOne(() => User, user => user.sentMessages)
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: MessageType,
    default: MessageType.TEXT
  })
  type: MessageType;

  @Column({
    type: 'enum',
    enum: MessageStatus,
    default: MessageStatus.SENT
  })
  status: MessageStatus;

  @Column({ type: 'jsonb', nullable: true })
  attachments?: any[];

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @Column({ nullable: true })
  replyToId?: string;

  @ManyToOne(() => Message, message => message.replies)
  @JoinColumn({ name: 'replyToId' })
  replyTo?: Message;

  @Column({ type: 'simple-array', nullable: true })
  replies?: string[];

  @Column({ nullable: true })
  editedAt?: Date;

  @Column({ default: false })
  isEdited: boolean;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ nullable: true })
  deletedAt?: Date;

  @Column({ default: false })
  isRead: boolean;

  @Column({ nullable: true })
  readAt?: Date;

  @Column({ default: false })
  isEncrypted: boolean;

  @Column({ nullable: true })
  reason?: string;

  @Column({ nullable: true })
  deliveredAt?: Date;

  @Column({ nullable: true })
  failedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}