import express from 'express';
import { userController } from './user.controller';
export const userRouter = express.Router();

userRouter.get('/', userController.get)

userRouter.put('/', userController.update)

// userRouter.post('/uploader',userController.uploader)

// userRouter.delete('/images/remove',userController.imageRemove)

// userRouter.get('/images/:id', userController.getImages)