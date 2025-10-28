import { Router } from 'express';
import { messageController } from '../controllers/messageController';
import { authenticateToken } from '../middleware/auth';
import { validateDto } from '../middleware/dtoValidation';
import { CreateChatDto, UpdateChatDto, ChatSearchDto, SendMessageDto, UpdateMessageDto, MessageSearchDto, UpdateMessageStatusDto, UnblockUserDto, MessageStatsDto, ChatParamDto, MessageParamDto } from '../dto/MessageDto';
import { BlockUserDto } from '../dto/AdminDto';

const router = Router();

// Всі маршрути потребують авторизації
router.use(authenticateToken);

// Управління чатами
router.get('/chats',
  validateDto(ChatSearchDto, true),
  messageController.getUserChats
);
router.post('/chats',
  validateDto(CreateChatDto, false),
  messageController.createChat
);
router.put('/chats/:chatId',
  validateDto(UpdateChatDto, false),
  messageController.updateChat
);

// Управління повідомленнями
router.get('/chats/:chatId/messages',
  validateDto(MessageSearchDto, true),
  messageController.getChatMessages
);
router.post('/chats/:chatId/messages',
  validateDto(SendMessageDto, false),
  messageController.sendMessage
);
router.put('/messages/:messageId',
  validateDto(UpdateMessageDto, false),
  messageController.updateMessage
);
router.patch('/messages/:messageId/status',
  validateDto(UpdateMessageStatusDto, false),
  messageController.updateMessageStatus
);
router.delete('/messages/:messageId',
  validateDto(MessageParamDto, true),
  messageController.deleteMessage
);

// Дії з чатами
router.post('/chats/:chatId/read',
  validateDto(ChatParamDto, true),
  messageController.markChatAsRead
);
router.post('/chats/:chatId/block',
  validateDto(BlockUserDto, false),
  messageController.blockUser
);
router.post('/chats/:chatId/unblock',
  validateDto(UnblockUserDto, false),
  messageController.unblockUser
);

// Пошук та статистика
router.get('/search',
  validateDto(MessageSearchDto, true),
  messageController.searchMessages
);
router.get('/unread',
  messageController.getUnreadMessages
);
router.get('/stats',
  validateDto(MessageStatsDto, true),
  messageController.getMessageStats
);

export default router;