var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index', { title: '버스야 어디있니?'});
});

router.post('/', function(req, res) {
  console.dir('실시간 버스 검색');
  res.render('index', { title: '버스야 어디있니?'});
});

router.get('/search', function(req, res) {
  console.dir(req.query);
  let routeNo = req.query.routeNo;
  res.render('search', { result: `${routeNo}번 버스 검색 결과 출력 예정` });
});

module.exports = router;