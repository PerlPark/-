var express = require('express');
var router = express.Router();
const controller = require('./controller');

/* 메인 접속 렌더링 */
router.get('/', controller.main);
router.post('/', controller.loading);
router.get('/position', controller.searchPosition);
router.get('/bus', controller.searchBus);
router.get('/support/bus', controller.supportBus);

module.exports = router;