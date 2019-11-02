var express = require('express');
var router = express.Router();
const controller = require('./controller');
const controllerm = require('./controller_m');
const busList = require('../config/buslist.json');

router.get('/', function(req, res) {
  res.render('main', { title: '버스야 어디가니?' });
});

router.get('/position', function(req, res) {
  res.render('search-position', { title: '버스야 어디가니? > 위치 지정' });
});

router.get('/bus', function(req, res) {
  res.render('search-bus', { title: '버스야 어디가니? > 버스 검색' });
});

router.post('/bus', controller.searchBusResult);

router.get('/support/bus', function(req, res) {
  res.render('support-bus', { title: '버스야 어디가니? > 지원하는 버스 목록', busList: busList });
});

router.get('/master', controllerm.main);
router.get('/master/update/bus', controllerm.updateBus);
router.get('/master/update/bus/detail', controllerm.updateBusDetail);

module.exports = router;