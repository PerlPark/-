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
  let li = '';
  station(req.query.lat, req.query.lng, function(list){
    // list.forEach(function(data){
    //   console.log(data);
    //   li += `${data.name}`;
    // });
    res.render('search', { dataList: list } );
  });
});

/* 좌표 기반 주변 정류소 찾기 API */
function station(lat, lng, func){
  console.log(lat, lng, '정류소 조회 준비');
  /* 버스 API 준비 */
  let request = require('request');
  let cheerio = require('cheerio');
  let API = require('../config/api.json');

  let url1 = `${API.urlGyeonggi}?serviceKey=${API.KEY}&x=${lng}&y=${lat}`;
  let url2 = `${API.urlAllCountry}?serviceKey=${API.KEY}&gpsLati=${lat}&gpsLong=${lng}`;

  var list = [];

  /* 1. 경기도 버스 api */
  request(url1, function(err, res, body){
    $ = cheerio.load(body);
    if($('busStationAroundList').length > 0){
      $('busStationAroundList').each(function(i){
        let id = $(this).find('stationId').text();
        let name = $(this).find('stationName').text();
        let code = $(this).find('mobileNo').text();
        list.push({'id': id, 'name': name, 'code': code});
      });
    } else {
      request(url2, function(err, res, body){
        $ = cheerio.load(body);
        if($('item').length > 0){
          $('item').each(function(i){
            let name = $(this).find('nodenm').text();
            let code = $(this).find('nodeno').text();
            console.log(`${i}: ${name}, ${code}\n`);
          });
        } else {
          list.push('결과를 찾을 수 없습니다.');
        }
      });
    }
    func(list);
  });
}

module.exports = router;