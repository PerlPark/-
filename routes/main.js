var express = require('express');
var router = express.Router();
const controller = require('./controller');

/* 메인 접속 렌더링 */
router.get('/available', controller.available);

module.exports = router;