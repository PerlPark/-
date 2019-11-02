var express = require('express');
var router = express.Router();
const controller = require('./controller');
const master = require('./master');
const busList = require('../config/buslist.json');

router.get('/', function(req, res) {
  // if(req.query.no && req.query.id){
  //   res.render('main_data', { title: '버스야 어디가니?', routeNo: req.query.no, routeId: req.query.id });
  // } else {
    
  // }
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

router.get('/master', master.main);
router.get('/master/update/bus', master.updateBus);

module.exports = router;