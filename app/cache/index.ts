const express = require('express');
const router = express.Router();

import { AuthenticationMiddleware } from "../http/middleware/auth";
import { RoleMiddleware } from "../http/middleware/role";
import { Redis } from "./cache.controller";

let role_controller = new RoleMiddleware();
let redis_controller = new Redis()
let auth_controller = new AuthenticationMiddleware();

router.get('/keys/get', auth_controller.isAuthenticated(), redis_controller.getKeys)

router.delete('/keys/delete', auth_controller.isAuthenticated(), role_controller.isAdmin(), redis_controller.flushdb)

router.delete('/keys/delete/auth', auth_controller.isAuthenticated(), role_controller.isAdmin(), redis_controller.flushAuth)

module.exports = router;