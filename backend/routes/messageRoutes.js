import express from 'express';
import {
  getMessages,
  createMessage,
  getMessageById,
  markMessageAsRead,
  deleteMessage
} from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getMessages)
  .post(protect, createMessage);

router.route('/:id')
  .get(protect, getMessageById)
  .delete(protect, deleteMessage);

router.route('/:id/read')
  .put(protect, markMessageAsRead);

export default router;
