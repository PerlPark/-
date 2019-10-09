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

/* 노선 아이디 찾기 API */
function busRoute(routeNo, func){
  let request = require('request');
  let cheerio = require('cheerio');
  let API = require('../config/api.json');

  /* 키워드로 노선 ID 조회 */
  let url = `${API.busroute_gyeonggi.url}?serviceKey=${API.KEY}&${API.busroute_gyeonggi.param}=${routeNo}`;
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
          list.push({'id': routeId, 'region': region, 'name': routeName, 'typeName': routeTypeName});
        }
      });
      list.sort(function(a, b){
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
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

/* ************************************************* */
/* ******************** search  ******************** */
router.get('/search', function(req, res) {
  getAroundStation(req.query.lat, req.query.lng)
  .then(function(aroundStation){
    getBusArrivalData(aroundStation, req.query.routeId)
    .then(function(data){
      res.render('search', { dataList: data } );
    }).catch(function(error) {
      console.log(error);
      res.render('error', { message: `현재 내 주변에 ${req.query.routeId}번 버스 이용이 가능한 정류장이 없습니다.` });
    });
  }).catch(function(error) {
    console.log(error);
    res.render('error', { message: `현재 내 주변 500m 안에 정류장이 없습니다.` });
  });
});

/* Step 1. 주변 정류소 목록 조회 API */
function getAroundStation(lat, lng){
  return new Promise(function (resolve, reject) {
    /* 버스 API 준비 */
    let request = require('request');
    let cheerio = require('cheerio');
    let API = require('../config/api.json');
    let url = `${API.aroundStation_gyeonggi.url}?serviceKey=${API.KEY}&x=${lng}&y=${lat}`;

    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        let $ = cheerio.load(body);
        let result = [];
        if($('busStationAroundList').length <= 0){
          reject('getAroundStation > request오류!');
        } else {
          $('busStationAroundList').each(function(){
            let stationId = $(this).find('stationId').text();
            let stationName = $(this).find('stationName').text();
            let stationCode = $(this).find('mobileNo').text();
            result.push({'id': stationId, 'name': stationName, 'code': stationCode});  
          });
          resolve(result);
        }
      } else {
        reject('getAroundStation 오류!');
      }
    });
  });
}

/* Step 2. 버스 도착 정보 조회 API */
function getBusArrivalData(aroundStation, routeId){
  return new Promise(function (resolve, reject) {
    let request = require('request');
    let cheerio = require('cheerio');
    let API = require('../config/api.json');
    function recusionRequest(aroundStationItem, result){
      let url = `${API.busArrival_gyeonggi.url}?serviceKey=${API.KEY}&${API.busArrival_gyeonggi.param}=${aroundStationItem.id}`;
      request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          let $ = cheerio.load(body);
          if($('busArrivalList').length > 0){
            $('busArrivalList').each(function(i){
              let id = $(this).find('routeId').text();
              if(id === routeId){
                let plateNo1 = $(this).find('plateNo1').text();
                let locationNo1 = $(this).find('locationNo1').text();
                let predictTime1 = $(this).find('predictTime1').text();
                let data = {
                  "staOrder": i,
                  "stationId": aroundStationItem.id,
                  "stationName": aroundStationItem.name,
                  "stationCode": aroundStationItem.code,
                  "plateNo1": plateNo1,
                  "locationNo1": locationNo1,
                  "predictTime1": predictTime1
                };
                console.log(aroundStationItem);
                console.log(data);
                console.log("===========================================");
                result.push(data);
              }
            });
          }
        }
        if(aroundStation.length > 0){
          recusionRequest(aroundStation.shift(), result);
        } else {
          returnResult();
        }
      });
    }
    /* recusionRequest 실행 */
    recusionRequest(aroundStation.shift(), []);
    function returnResult(){
      if(result = []){
        reject('getBusArrivalData 오류! > 결과 값이 없음');
      }
      resolve(result);
    }
  });
}

module.exports = router;