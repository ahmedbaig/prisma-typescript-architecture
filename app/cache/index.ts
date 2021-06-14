import authMiddleware from "../http/middleware/auth";
import roleMiddleware from "../http/middleware/role";
import { redisController } from "./cache.controller";

const express = require('express');
const router = express.Router();


router.get('/keys/get', authMiddleware.isAuthenticated(), redisController.getKeys)

router.delete('/keys/delete', authMiddleware.isAuthenticated(), roleMiddleware.isAdmin(), redisController.flushdb)

router.delete('/keys/delete/auth', authMiddleware.isAuthenticated(), roleMiddleware.isAdmin(), redisController.flushAuth)

module.exports = router;