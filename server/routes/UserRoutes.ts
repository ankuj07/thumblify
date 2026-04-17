import express from 'express';
import { getUserThumbnails, getThumbnailById, getCredits, getProfile, updateProfile } from '../controller/UserController.js';
import protect from '../middlewares/auth.js';

const UserRouter = express.Router();

UserRouter.get('/thumbnails', protect, getUserThumbnails);
UserRouter.get('/thumbnail/:id', protect, getThumbnailById);
UserRouter.get('/credits', protect, getCredits);
UserRouter.get('/profile', protect, getProfile);
UserRouter.put('/profile', protect, updateProfile);

export default UserRouter;