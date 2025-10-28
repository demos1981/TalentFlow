import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { User } from '../models/User';
import { Message, MessageStatus } from '../models/Message';
import { Chat } from '../models/Chat';
import {
  CreateChatDto,
  UpdateChatDto,
  ChatSearchDto,
  SendMessageDto,
  UpdateMessageDto,
  MessageSearchDto,
  UpdateMessageStatusDto,
  BlockUserDto,
  UnblockUserDto,
  MessageStatsDto
} from '../dto/MessageDto';

export interface MessageSearchResult {
  messages: Message[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters: MessageSearchDto;
}

export interface ChatSearchResult {
  chats: Chat[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters: ChatSearchDto;
}

export interface MessageStats {
  totalMessages: number;
  messagesByType: Array<{ type: string; count: number }>;
  messagesByStatus: Array<{ status: string; count: number }>;
  totalChats: number;
  activeChats: number;
  unreadMessages: number;
  messagesToday: number;
  messagesThisWeek: number;
  messagesThisMonth: number;
  averageMessagesPerChat: number;
  topChats: Array<{ chatId: string; messageCount: number }>;
}

export class MessageService {
  private messageRepository: Repository<Message>;
  private chatRepository: Repository<Chat>;
  private userRepository: Repository<User>;

  constructor() {
    this.messageRepository = AppDataSource.getRepository(Message);
    this.chatRepository = AppDataSource.getRepository(Chat);
    this.userRepository = AppDataSource.getRepository(User);
  }

  /**
   * Отримання чатів користувача
   */
  async getUserChats(filters: ChatSearchDto, page: number = 1, limit: number = 20, userId: string): Promise<ChatSearchResult> {
    try {
      const offset = (page - 1) * limit;

      const queryBuilder = this.chatRepository
        .createQueryBuilder('chat')
        .leftJoinAndSelect('chat.participantsList', 'participants')
        .leftJoinAndSelect('chat.lastMessage', 'lastMessage')
        .leftJoinAndSelect('chat.createdByUser', 'createdByUser')
        .where('participants.id = :userId', { userId })
        .andWhere('chat.isActive = :isActive', { isActive: true });

      // Фільтр по пошуку
      if (filters.search) {
        queryBuilder.andWhere(
          '(chat.name ILIKE :search OR chat.description ILIKE :search)',
          { search: `%${filters.search}%` }
        );
      }

      // Фільтр по типу
      if (filters.type) {
        queryBuilder.andWhere('chat.type = :type', { type: filters.type });
      }

      // Фільтр по статусу
      if (filters.status) {
        queryBuilder.andWhere('chat.status = :status', { status: filters.status });
      }

      // Фільтр по учаснику
      if (filters.participantId) {
        queryBuilder.andWhere('participants.id = :participantId', { participantId: filters.participantId });
      }

      // Фільтр по активності
      if (filters.isActive !== undefined) {
        queryBuilder.andWhere('chat.isActive = :isActive', { isActive: filters.isActive });
      }

      // Фільтр по непрочитаних повідомленнях
      if (filters.hasUnreadMessages !== undefined) {
        if (filters.hasUnreadMessages) {
          queryBuilder.andWhere('chat.unreadCount > 0');
        } else {
          queryBuilder.andWhere('chat.unreadCount = 0');
        }
      }

      // Фільтр по даті
      if (filters.startDate) {
        queryBuilder.andWhere('chat.createdAt >= :startDate', { startDate: filters.startDate });
      }

      if (filters.endDate) {
        queryBuilder.andWhere('chat.createdAt <= :endDate', { endDate: filters.endDate });
      }

      // Сортування
      queryBuilder.orderBy(`chat.${filters.sortBy}`, filters.sortOrder);

      // Підрахунок загальної кількості
      const total = await queryBuilder.getCount();

      // Отримання результатів з пагінацією
      const chats = await queryBuilder
        .skip(offset)
        .take(limit)
        .getMany();

      return {
        chats,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        filters
      };
    } catch (error) {
      console.error('Error getting user chats:', error);
      throw new Error(`Failed to get user chats: ${error.message}`);
    }
  }

  /**
   * Створення чату
   */
  async createChat(chatData: CreateChatDto, userId: string): Promise<Chat> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }

      // Додаємо створювача до учасників
      const participants = [...chatData.participants, userId];

      const chat = this.chatRepository.create({
        ...chatData,
        participants,
        createdBy: userId,
        isActive: true
      });

      return await this.chatRepository.save(chat);
    } catch (error) {
      console.error('Error creating chat:', error);
      throw new Error(`Failed to create chat: ${error.message}`);
    }
  }

  /**
   * Оновлення чату
   */
  async updateChat(chatId: string, updateData: UpdateChatDto, userId: string): Promise<Chat | null> {
    try {
      const chat = await this.chatRepository.findOne({
        where: { id: chatId },
        relations: ['participantsList', 'createdByUser']
      });
      
      if (!chat) {
        return null;
      }

      // Перевіряємо права доступу
      if (chat.createdBy !== userId) {
        throw new Error('Insufficient permissions');
      }

      // Оновлюємо поля
      Object.assign(chat, updateData);

      return await this.chatRepository.save(chat);
    } catch (error) {
      console.error('Error updating chat:', error);
      throw new Error(`Failed to update chat: ${error.message}`);
    }
  }

  /**
   * Отримання повідомлень чату
   */
  async getChatMessages(chatId: string, filters: MessageSearchDto, page: number = 1, limit: number = 50, userId: string): Promise<MessageSearchResult> {
    try {
      const offset = (page - 1) * limit;

      const queryBuilder = this.messageRepository
        .createQueryBuilder('message')
        .leftJoinAndSelect('message.sender', 'sender')
        .leftJoinAndSelect('message.chat', 'chat')
        .leftJoinAndSelect('message.replyTo', 'replyTo')
        .where('message.chatId = :chatId', { chatId })
        .andWhere('chat.participantsList.id = :userId', { userId });

      // Фільтр по пошуку
      if (filters.search) {
        queryBuilder.andWhere('message.content ILIKE :search', { search: `%${filters.search}%` });
      }

      // Фільтр по типу
      if (filters.type) {
        queryBuilder.andWhere('message.type = :type', { type: filters.type });
      }

      // Фільтр по статусу
      if (filters.status) {
        queryBuilder.andWhere('message.status = :status', { status: filters.status });
      }

      // Фільтр по відправнику
      if (filters.senderId) {
        queryBuilder.andWhere('message.senderId = :senderId', { senderId: filters.senderId });
      }

      // Фільтр по даті
      if (filters.startDate) {
        queryBuilder.andWhere('message.createdAt >= :startDate', { startDate: filters.startDate });
      }

      if (filters.endDate) {
        queryBuilder.andWhere('message.createdAt <= :endDate', { endDate: filters.endDate });
      }

      // Фільтр по прочитаності
      if (filters.isRead !== undefined) {
        queryBuilder.andWhere('message.isRead = :isRead', { isRead: filters.isRead });
      }

      // Фільтр по шифруванню
      if (filters.isEncrypted !== undefined) {
        queryBuilder.andWhere('message.isEncrypted = :isEncrypted', { isEncrypted: filters.isEncrypted });
      }

      // Сортування
      queryBuilder.orderBy(`message.${filters.sortBy}`, filters.sortOrder);

      // Підрахунок загальної кількості
      const total = await queryBuilder.getCount();

      // Отримання результатів з пагінацією
      const messages = await queryBuilder
        .skip(offset)
        .take(limit)
        .getMany();

      return {
        messages,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        filters
      };
    } catch (error) {
      console.error('Error getting chat messages:', error);
      throw new Error(`Failed to get chat messages: ${error.message}`);
    }
  }

  /**
   * Відправка повідомлення
   */
  async sendMessage(chatId: string, messageData: SendMessageDto, userId: string): Promise<Message> {
    try {
      const chat = await this.chatRepository.findOne({
        where: { id: chatId },
        relations: ['participantsList']
      });

      if (!chat) {
        throw new Error('Chat not found');
      }

      // Перевіряємо, чи користувач є учасником чату
      const isParticipant = chat.participantsList.some(participant => participant.id === userId);
      if (!isParticipant) {
        throw new Error('User is not a participant of this chat');
      }

      // Перевіряємо, чи користувач не заблокований
      if (chat.blockedUsers?.includes(userId)) {
        throw new Error('User is blocked in this chat');
      }

      const message = this.messageRepository.create({
        ...messageData,
        chatId,
        senderId: userId,
        status: MessageStatus.SENT
      });

      const savedMessage = await this.messageRepository.save(message);

      // Оновлюємо чат з останнім повідомленням
      await this.chatRepository.update(chatId, {
        lastMessageAt: new Date(),
        lastMessageId: savedMessage.id,
        unreadCount: chat.unreadCount + 1
      });

      return savedMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error(`Failed to send message: ${error.message}`);
    }
  }

  /**
   * Оновлення повідомлення
   */
  async updateMessage(messageId: string, updateData: UpdateMessageDto, userId: string): Promise<Message | null> {
    try {
      const message = await this.messageRepository.findOne({
        where: { id: messageId },
        relations: ['sender', 'chat']
      });
      
      if (!message) {
        return null;
      }

      // Перевіряємо права доступу
      if (message.senderId !== userId) {
        throw new Error('Insufficient permissions');
      }

      // Оновлюємо поля
      Object.assign(message, updateData);
      message.isEdited = true;
      message.editedAt = new Date();

      return await this.messageRepository.save(message);
    } catch (error) {
      console.error('Error updating message:', error);
      throw new Error(`Failed to update message: ${error.message}`);
    }
  }

  /**
   * Оновлення статусу повідомлення
   */
  async updateMessageStatus(messageId: string, statusData: UpdateMessageStatusDto, userId: string): Promise<Message | null> {
    try {
      const message = await this.messageRepository.findOne({
        where: { id: messageId },
        relations: ['sender', 'chat']
      });
      
      if (!message) {
        return null;
      }

      message.status = statusData.status;
      if (statusData.reason) message.reason = statusData.reason;
      if (statusData.timestamp) message.updatedAt = new Date(statusData.timestamp);
      else message.updatedAt = new Date();

      // Встановлюємо відповідні дати
      if (statusData.status === MessageStatus.DELIVERED) {
        message.deliveredAt = new Date();
      } else if (statusData.status === MessageStatus.READ) {
        message.readAt = new Date();
        message.isRead = true;
      } else if (statusData.status === MessageStatus.FAILED) {
        message.failedAt = new Date();
      }
      
      return await this.messageRepository.save(message);
    } catch (error) {
      console.error('Error updating message status:', error);
      throw new Error(`Failed to update message status: ${error.message}`);
    }
  }

  /**
   * Видалення повідомлення
   */
  async deleteMessage(messageId: string, userId: string): Promise<boolean> {
    try {
      const message = await this.messageRepository.findOne({
        where: { id: messageId }
      });
      
      if (!message) {
        return false;
      }

      // Перевіряємо права доступу
      if (message.senderId !== userId) {
        throw new Error('Insufficient permissions');
      }

      // Soft delete
      message.isDeleted = true;
      message.deletedAt = new Date();
      await this.messageRepository.save(message);
      
      return true;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw new Error(`Failed to delete message: ${error.message}`);
    }
  }

  /**
   * Позначення чату як прочитаний
   */
  async markChatAsRead(chatId: string, userId: string): Promise<boolean> {
    try {
      const chat = await this.chatRepository.findOne({
        where: { id: chatId }
      });
      
      if (!chat) {
        return false;
      }

      // Оновлюємо статус всіх непрочитаних повідомлень в чаті
      await this.messageRepository.update(
        { chatId, isRead: false },
        { isRead: true, readAt: new Date() }
      );

      // Оновлюємо лічильник непрочитаних повідомлень
      await this.chatRepository.update(chatId, {
        unreadCount: 0
      });

      return true;
    } catch (error) {
      console.error('Error marking chat as read:', error);
      throw new Error(`Failed to mark chat as read: ${error.message}`);
    }
  }

  /**
   * Блокування користувача
   */
  async blockUser(chatId: string, blockData: BlockUserDto, userId: string): Promise<boolean> {
    try {
      const chat = await this.chatRepository.findOne({
        where: { id: chatId }
      });
      
      if (!chat) {
        return false;
      }

      // Перевіряємо права доступу
      if (chat.createdBy !== userId) {
        throw new Error('Insufficient permissions');
      }

      // Додаємо користувача до списку заблокованих
      const blockedUsers = chat.blockedUsers || [];
      if (!blockedUsers.includes(blockData.userId)) {
        blockedUsers.push(blockData.userId);
      }

      await this.chatRepository.update(chatId, {
        blockedUsers,
        blockReason: blockData.reason,
        blockMessages: blockData.blockMessages !== undefined ? blockData.blockMessages : true,
        blockCalls: blockData.blockCalls !== undefined ? blockData.blockCalls : true
      });

      return true;
    } catch (error) {
      console.error('Error blocking user:', error);
      throw new Error(`Failed to block user: ${error.message}`);
    }
  }

  /**
   * Розблокування користувача
   */
  async unblockUser(chatId: string, unblockData: UnblockUserDto, userId: string): Promise<boolean> {
    try {
      const chat = await this.chatRepository.findOne({
        where: { id: chatId }
      });
      
      if (!chat) {
        return false;
      }

      // Перевіряємо права доступу
      if (chat.createdBy !== userId) {
        throw new Error('Insufficient permissions');
      }

      // Видаляємо користувача зі списку заблокованих
      const blockedUsers = chat.blockedUsers || [];
      const updatedBlockedUsers = blockedUsers.filter(id => id !== unblockData.userId);

      await this.chatRepository.update(chatId, {
        blockedUsers: updatedBlockedUsers
      });

      return true;
    } catch (error) {
      console.error('Error unblocking user:', error);
      throw new Error(`Failed to unblock user: ${error.message}`);
    }
  }

  /**
   * Пошук повідомлень
   */
  async searchMessages(filters: MessageSearchDto, page: number = 1, limit: number = 20, userId: string): Promise<MessageSearchResult> {
    try {
      const offset = (page - 1) * limit;

      const queryBuilder = this.messageRepository
        .createQueryBuilder('message')
        .leftJoinAndSelect('message.sender', 'sender')
        .leftJoinAndSelect('message.chat', 'chat')
        .leftJoinAndSelect('message.replyTo', 'replyTo')
        .leftJoin('chat.participantsList', 'participants')
        .where('participants.id = :userId', { userId });

      // Фільтр по пошуку
      if (filters.search) {
        queryBuilder.andWhere('message.content ILIKE :search', { search: `%${filters.search}%` });
      }

      // Фільтр по типу
      if (filters.type) {
        queryBuilder.andWhere('message.type = :type', { type: filters.type });
      }

      // Фільтр по статусу
      if (filters.status) {
        queryBuilder.andWhere('message.status = :status', { status: filters.status });
      }

      // Фільтр по чату
      if (filters.chatId) {
        queryBuilder.andWhere('message.chatId = :chatId', { chatId: filters.chatId });
      }

      // Фільтр по відправнику
      if (filters.senderId) {
        queryBuilder.andWhere('message.senderId = :senderId', { senderId: filters.senderId });
      }

      // Фільтр по даті
      if (filters.startDate) {
        queryBuilder.andWhere('message.createdAt >= :startDate', { startDate: filters.startDate });
      }

      if (filters.endDate) {
        queryBuilder.andWhere('message.createdAt <= :endDate', { endDate: filters.endDate });
      }

      // Фільтр по прочитаності
      if (filters.isRead !== undefined) {
        queryBuilder.andWhere('message.isRead = :isRead', { isRead: filters.isRead });
      }

      // Фільтр по шифруванню
      if (filters.isEncrypted !== undefined) {
        queryBuilder.andWhere('message.isEncrypted = :isEncrypted', { isEncrypted: filters.isEncrypted });
      }

      // Сортування
      queryBuilder.orderBy(`message.${filters.sortBy}`, filters.sortOrder);

      // Підрахунок загальної кількості
      const total = await queryBuilder.getCount();

      // Отримання результатів з пагінацією
      const messages = await queryBuilder
        .skip(offset)
        .take(limit)
        .getMany();

      return {
        messages,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        filters
      };
    } catch (error) {
      console.error('Error searching messages:', error);
      throw new Error(`Failed to search messages: ${error.message}`);
    }
  }

  /**
   * Отримання непрочитаних повідомлень
   */
  async getUnreadMessages(userId: string): Promise<Message[]> {
    try {
      return await this.messageRepository
        .createQueryBuilder('message')
        .leftJoinAndSelect('message.sender', 'sender')
        .leftJoinAndSelect('message.chat', 'chat')
        .leftJoin('chat.participantsList', 'participants')
        .where('participants.id = :userId', { userId })
        .andWhere('message.isRead = :isRead', { isRead: false })
        .orderBy('message.createdAt', 'DESC')
        .getMany();
    } catch (error) {
      console.error('Error getting unread messages:', error);
      throw new Error(`Failed to get unread messages: ${error.message}`);
    }
  }

  /**
   * Отримання статистики повідомлень
   */
  async getMessageStats(statsDto: MessageStatsDto, userId: string): Promise<MessageStats> {
    try {
      const {
        chatId,
        startDate,
        endDate
      } = statsDto;

      const queryBuilder = this.messageRepository
        .createQueryBuilder('message')
        .leftJoin('message.chat', 'chat')
        .leftJoin('chat.participantsList', 'participants')
        .where('participants.id = :userId', { userId });

      // Фільтр по чату
      if (chatId) {
        queryBuilder.andWhere('message.chatId = :chatId', { chatId });
      }

      // Фільтр по даті
      if (startDate) {
        queryBuilder.andWhere('message.createdAt >= :startDate', { startDate });
      }

      if (endDate) {
        queryBuilder.andWhere('message.createdAt <= :endDate', { endDate });
      }

      // Загальна кількість повідомлень
      const totalMessages = await queryBuilder.getCount();

      // Статистика по типах
      const messagesByType = await queryBuilder
        .clone()
        .select('message.type', 'type')
        .addSelect('COUNT(*)', 'count')
        .groupBy('message.type')
        .orderBy('count', 'DESC')
        .getRawMany();

      // Статистика по статусах
      const messagesByStatus = await queryBuilder
        .clone()
        .select('message.status', 'status')
        .addSelect('COUNT(*)', 'count')
        .groupBy('message.status')
        .orderBy('count', 'DESC')
        .getRawMany();

      // Загальна кількість чатів
      const totalChats = await this.chatRepository
        .createQueryBuilder('chat')
        .leftJoin('chat.participantsList', 'participants')
        .where('participants.id = :userId', { userId })
        .getCount();

      // Активні чати
      const activeChats = await this.chatRepository
        .createQueryBuilder('chat')
        .leftJoin('chat.participantsList', 'participants')
        .where('participants.id = :userId', { userId })
        .andWhere('chat.isActive = :isActive', { isActive: true })
        .getCount();

      // Непрочитані повідомлення
      const unreadMessages = await this.messageRepository
        .createQueryBuilder('message')
        .leftJoin('message.chat', 'chat')
        .leftJoin('chat.participantsList', 'participants')
        .where('participants.id = :userId', { userId })
        .andWhere('message.isRead = :isRead', { isRead: false })
        .getCount();

      // Повідомлення сьогодні
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const messagesToday = await queryBuilder
        .clone()
        .andWhere('message.createdAt >= :today', { today })
        .getCount();

      // Повідомлення цього тижня
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const messagesThisWeek = await queryBuilder
        .clone()
        .andWhere('message.createdAt >= :weekAgo', { weekAgo })
        .getCount();

      // Повідомлення цього місяця
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      const messagesThisMonth = await queryBuilder
        .clone()
        .andWhere('message.createdAt >= :monthAgo', { monthAgo })
        .getCount();

      // Середня кількість повідомлень на чат
      const averageMessagesPerChat = totalChats > 0 ? totalMessages / totalChats : 0;

      // Топ чатів
      const topChats = await queryBuilder
        .clone()
        .select('message.chatId', 'chatId')
        .addSelect('COUNT(*)', 'messageCount')
        .groupBy('message.chatId')
        .orderBy('messageCount', 'DESC')
        .limit(10)
        .getRawMany();

      return {
        totalMessages,
        messagesByType: messagesByType.map(item => ({
          type: item.type,
          count: parseInt(item.count)
        })),
        messagesByStatus: messagesByStatus.map(item => ({
          status: item.status,
          count: parseInt(item.count)
        })),
        totalChats,
        activeChats,
        unreadMessages,
        messagesToday,
        messagesThisWeek,
        messagesThisMonth,
        averageMessagesPerChat: Math.round(averageMessagesPerChat * 10) / 10,
        topChats: topChats.map(item => ({
          chatId: item.chatId,
          messageCount: parseInt(item.messageCount)
        }))
      };
    } catch (error) {
      console.error('Error getting message stats:', error);
      throw new Error(`Failed to get message stats: ${error.message}`);
    }
  }
}

// Експортуємо екземпляр сервісу для використання в контролері
export const messageService = new MessageService();