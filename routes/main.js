var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index', { title: '버스야 어디있니?'});
});

router.post('/', function(req, res) {
  /* 실시간 버스 검색 처리 */
  busRoute(req.body.routeNo, function(list){
    res.send(list);
  });
});

router.get('/search', function(req, res) {
  console.dir(req.query);
  let li = '';
  station(req.query.routeNo, req.query.lat, req.query.lng, function(list){
    res.render('search', { dataList: list } );
  });
});

/* 1. 루트 아이디 찾기 API */
function busRoute(routeNo, func){
  let request = require('request');
  let cheerio = require('cheerio');
  let API = require('../config/api.json');

  /* 키워드로 노선 ID 조회 */
  let url = `${API.busroute_gyonggi.url}?serviceKey=${API.KEY}&${API.busroute_gyonggi.param}=${routeNo}`;
  var list = [];
  request(url, function(err, res, data){
    $ = cheerio.load(data);
    if($('busRouteList').length > 0){
      $('busRouteList').each(function(i){
        let routeId = $(this).find('routeId').text();
        let region = $(this).find('regionName').text();
        let routeName = $(this).find('routeName').text();
        let routeTypeName = $(this).find('routeTypeName').text();
        if(routeName.length-1 <= routeNo.length && routeName.slice(0, routeNo.length) === routeNo){
          list.push({'routeId': routeId, 'region': region, 'routeName': routeName, 'routeTypeName': routeTypeName});
        }
      });
      list.sort(function(a, b){
        if (a.routeName > b.routeName) {
          return 1;
        }
        if (a.routeName < b.routeName) {
          return -1;
        }
        return 0;
      });
    } else {
      list.push('검색 결과가 없습니다.');
    }
    func(list);
  });
}













































/* 좌표 기반 주변 정류소 찾기 API */
function station(routeNo, lat, lng, func){
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
            let id = $(this).find('nodeid').text();
            let name = $(this).find('nodenm').text();
            let code = $(this).find('nodeno').text();
            list.push({'id': id, 'name': name, 'code': code});
          });
        } else {
          list.push('결과를 찾을 수 없습니다.');
        }
      });
    }
    func(list);
    // function filtering(func){
    //   let url3 = `${API.urlGyeonggi_BusArrivalService}?serviceKey=${API.KEY}&stationId=${routeNo}&routeId=${routeNo}&routeId=`;

    // }
  });
}

module.exports = router;