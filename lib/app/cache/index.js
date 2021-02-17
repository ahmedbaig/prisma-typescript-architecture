'use strict';
var express = require('express');
var auth = require('../../app/http/middleware/auth');
var controller = require('./cache.controller');
var role = require('../../app/http/middleware/role');
var router = express.Router();
router.get('/keys/get', auth.isAuthenticated(), controller.getRedisKeys);
router.delete('/keys/delete', auth.isAuthenticated(), role.isAdmin(), controller.flushdb);
router.delete('/keys/delete/auth', auth.isAuthenticated(), role.isAdmin(), controller.flushAuth);
module.exports = router;
//# sourceMappingURL=index.js.map