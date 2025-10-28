import { Request, Response } from 'express';
import { messageService } from '../services/messageService';
import { validateDto } from '../middleware/dtoValidation';
import { CreateChatDto, UpdateChatDto, ChatSearchDto, SendMessageDto, UpdateMessageDto, MessageSearchDto, UpdateMessageStatusDto, UnblockUserDto, MessageStatsDto, ChatParamDto, MessageParamDto } from '../dto/MessageDto';
import { BlockUserDto } from '../dto/AdminDto';
import { UuidParamDto } from '../dto/CommonDto';

export const messageController = {
  /**
   * Отримання чатів користувача
   */
  async getUserChats(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(ChatSearchDto, true)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const searchFilters: ChatSearchDto = req.query as any;
      const result = await messageService.getUserChats(searchFilters, undefined, undefined, userId);
      
      res.status(200).json({
        success: true,
        message: 'Chats retrieved successfully',
        data: result
      });
    } catch (error) {
      console.error('Error getting chats:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting chats',
        error: error.message
      });
    }
  },

  /**
   * Створення чату
   */
  async createChat(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(CreateChatDto, false)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const chatData: CreateChatDto = req.body;
      const chat = await messageService.createChat(chatData, userId);
      
      res.status(201).json({
        success: true,
        message: 'Chat created successfully',
        data: chat
      });
    } catch (error) {
      console.error('Error creating chat:', error);
      res.status(400).json({
        success: false,
        message: 'Error creating chat',
        error: error.message
      });
    }
  },

  /**
   * Оновлення чату
   */
  async updateChat(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(UpdateChatDto, false)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const { chatId } = req.params;
      const updateData: UpdateChatDto = req.body;
      const chat = await messageService.updateChat(chatId, updateData, userId);
      
      if (!chat) {
        res.status(404).json({
          success: false,
          message: 'Chat not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Chat updated successfully',
        data: chat
      });
    } catch (error) {
      console.error('Error updating chat:', error);
      res.status(400).json({
        success: false,
        message: 'Error updating chat',
        error: error.message
      });
    }
  },

  /**
   * Отримання повідомлень чату
   */
  async getChatMessages(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(MessageSearchDto, true)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const { chatId } = req.params;
      const searchFilters: MessageSearchDto = req.query as any;
      const result = await messageService.getChatMessages(chatId, searchFilters, undefined, undefined, userId);
      
      res.status(200).json({
        success: true,
        message: 'Messages retrieved successfully',
        data: result
      });
    } catch (error) {
      console.error('Error getting messages:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting messages',
        error: error.message
      });
    }
  },

  /**
   * Відправка повідомлення
   */
  async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(SendMessageDto, false)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const { chatId } = req.params;
      const messageData: SendMessageDto = req.body;
      const message = await messageService.sendMessage(chatId, messageData, userId);
      
      res.status(201).json({
        success: true,
        message: 'Message sent successfully',
        data: message
      });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(400).json({
        success: false,
        message: 'Error sending message',
        error: error.message
      });
    }
  },

  /**
   * Оновлення повідомлення
   */
  async updateMessage(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(UpdateMessageDto, false)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const { messageId } = req.params;
      const updateData: UpdateMessageDto = req.body;
      const message = await messageService.updateMessage(messageId, updateData, userId);
      
      if (!message) {
        res.status(404).json({
          success: false,
          message: 'Message not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Message updated successfully',
        data: message
      });
    } catch (error) {
      console.error('Error updating message:', error);
      res.status(400).json({
        success: false,
        message: 'Error updating message',
        error: error.message
      });
    }
  },

  /**
   * Оновлення статусу повідомлення
   */
  async updateMessageStatus(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(UpdateMessageStatusDto, false)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const { messageId } = req.params;
      const statusData: UpdateMessageStatusDto = req.body;
      const message = await messageService.updateMessageStatus(messageId, statusData, userId);
      
      if (!message) {
        res.status(404).json({
          success: false,
          message: 'Message not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Message status updated successfully',
        data: message
      });
    } catch (error) {
      console.error('Error updating message status:', error);
      res.status(400).json({
        success: false,
        message: 'Error updating message status',
        error: error.message
      });
    }
  },

  /**
   * Видалення повідомлення
   */
  async deleteMessage(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(MessageParamDto, true)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const { messageId } = req.params;
      const success = await messageService.deleteMessage(messageId, userId);
      
      if (!success) {
        res.status(404).json({
          success: false,
          message: 'Message not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Message deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting message',
        error: error.message
      });
    }
  },

  /**
   * Позначення чату як прочитаний
   */
  async markChatAsRead(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(ChatParamDto, true)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const { chatId } = req.params;
      const success = await messageService.markChatAsRead(chatId, userId);
      
      if (!success) {
        res.status(404).json({
          success: false,
          message: 'Chat not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Chat marked as read'
      });
    } catch (error) {
      console.error('Error marking chat as read:', error);
      res.status(500).json({
        success: false,
        message: 'Error marking chat as read',
        error: error.message
      });
    }
  },

  /**
   * Блокування користувача
   */
  async blockUser(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(BlockUserDto, false)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const { chatId } = req.params;
      const blockData: BlockUserDto = req.body;
      const success = await messageService.blockUser(chatId, blockData, userId);
      
      if (!success) {
        res.status(404).json({
          success: false,
          message: 'Chat not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'User blocked successfully'
      });
    } catch (error) {
      console.error('Error blocking user:', error);
      res.status(400).json({
        success: false,
        message: 'Error blocking user',
        error: error.message
      });
    }
  },

  /**
   * Розблокування користувача
   */
  async unblockUser(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(UnblockUserDto, false)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const { chatId } = req.params;
      const unblockData: UnblockUserDto = req.body;
      const success = await messageService.unblockUser(chatId, unblockData, userId);
      
      if (!success) {
        res.status(404).json({
          success: false,
          message: 'Chat not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'User unblocked successfully'
      });
    } catch (error) {
      console.error('Error unblocking user:', error);
      res.status(400).json({
        success: false,
        message: 'Error unblocking user',
        error: error.message
      });
    }
  },

  /**
   * Пошук повідомлень
   */
  async searchMessages(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(MessageSearchDto, true)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const searchFilters: MessageSearchDto = req.query as any;
      const result = await messageService.searchMessages(searchFilters, undefined, undefined, userId);
      
      res.status(200).json({
        success: true,
        message: 'Messages retrieved successfully',
        data: result
      });
    } catch (error) {
      console.error('Error searching messages:', error);
      res.status(500).json({
        success: false,
        message: 'Error searching messages',
        error: error.message
      });
    }
  },

  /**
   * Отримання непрочитаних повідомлень
   */
  async getUnreadMessages(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const unreadMessages = await messageService.getUnreadMessages(userId);
      
      res.status(200).json({
        success: true,
        message: 'Unread messages retrieved successfully',
        data: unreadMessages
      });
    } catch (error) {
      console.error('Error getting unread messages:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting unread messages',
        error: error.message
      });
    }
  },

  /**
   * Отримання статистики повідомлень
   */
  async getMessageStats(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = validateDto(MessageStatsDto, true)(req, res, () => {});
      if (validationResult) return;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authorization required'
        });
        return;
      }

      const statsFilters: MessageStatsDto = req.query as any;
      const stats = await messageService.getMessageStats(statsFilters, userId);
      
      res.status(200).json({
        success: true,
        message: 'Message statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      console.error('Error getting message stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting message statistics',
        error: error.message
      });
    }
  }
};