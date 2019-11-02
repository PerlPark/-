const config = require('../config/system.json');

let master = function(req, res) {
  console.log(req.query.pass, config.KEY);
  if(req.query.pass === config.KEY){
    res.render('master');
  } else {
    res.render('error', { message: '404' });
  }
}

let updateBus = function(req, res) {
  if(req.query.scope === 'all'){
    getAllBusList().then(function(result){
      res.json(result);
    }).catch(function(code){
      console.log(code);
    });
  } else if(req.query.num){
    getBusList(req.query.num).then(function(result){
      res.json(result);
    }).catch(function(code){
      console.log(code);
    });
  }
}


let updateBusDetail = function(req, res) {
  if(req.query.num){
    getBusDetail(req.query.num).then(function(result){
      res.json(result);
    }).catch(function(code){
      console.log(code);
    });
  }
}


/* 전체 버스 노선 목록 가져오기 API */
function getAllBusList(){
  return new Promise(function (resolve, reject) {
    let request = require('request');
    let cheerio = require('cheerio');
    let API = require('../config/api.json');

    function recursionRequest(count = 1, result = []){
      if(count > 9){
        result.sort(function(a, b){
          if (a.name > b.name) {
            return 1;
          }
          if (a.name < b.name) {
            return -1;
          }
          return 0;
        });
        resolve(result);
      } else {
        let url = `${API.busList_gyeonggi}?serviceKey=${API.KEY}&keyword=${count}`;
        request(url, function(err, res, data){
          if(err || res.statusCode !== 200){
            // request 오류 발생 시
            reject(res.statusCode);
          } else {
            // request 응답 성공 시
            $ = cheerio.load(data);
            $('busRouteList').each(function(i){
              let regionName = $(this).find('regionName').text();
              let routeId = $(this).find('routeId').text();
              let routeName = $(this).find('routeName').text();
              let routeTypeName = $(this).find('routeTypeName').text();
              let routeTypeCd = $(this).find('routeTypeCd').text();
              result.push({'region': regionName, 'id': routeId, 'name': routeName, 'typeName': routeTypeName, 'typeCode': routeTypeCd});
            });
            console.log(count, '처리 완료');
            recursionRequest(count + 1, result);
          }
        });
      }
    }
    recursionRequest();
  });
}


/* 특정 버스 노선 목록 가져오기 API */
function getBusList(number){
  return new Promise(function (resolve, reject) {
    let request = require('request');
    let cheerio = require('cheerio');
    let API = require('../config/api.json');

    let url = `${API.busList_gyeonggi}?serviceKey=${API.KEY}&keyword=${number}`;
    let result = [];
    request(url, function(err, res, data){
      if(err || res.statusCode !== 200){
        // request 오류 발생 시
        reject(res.statusCode);
      } else {
        // request 응답 성공 시
        $ = cheerio.load(data);
        $('busRouteList').each(function(i){
          let regionName = $(this).find('regionName').text();
          let routeId = $(this).find('routeId').text();
          let routeName = $(this).find('routeName').text();
          let routeTypeName = $(this).find('routeTypeName').text();
          let routeTypeCd = $(this).find('routeTypeCd').text();
          result.push({'region': regionName, 'id': routeId, 'name': routeName, 'typeName': routeTypeName, 'typeCode': routeTypeCd});
        });
        console.log(number, '로 시작하는 버스 목록 처리 완료');
        result.sort(function(a, b){
          if (a.name > b.name) {
            return 1;
          }
          if (a.name < b.name) {
            return -1;
          }
          return 0;
        });
        resolve(result);
      }
    });
  });
}


/* 버스 노선 상세 정보 가져오기 API */
function getBusDetail(number){
  return new Promise(function (resolve, reject) {
    let request = require('request');
    let cheerio = require('cheerio');
    let API = require('../config/api.json');
    let list = require(`../config/buslist/${number}.json`);

    function recursionRequest(i, result){
      if(i >= list.length){
        resolve(result);
      } else {
        let url = `${API.busList_gyeonggi}/info?serviceKey=${API.KEY}&routeId=${list[i].id}`;
        request(url, function(err, res, data){
          if(err || res.statusCode !== 200){
            // request 오류 발생 시
            reject(res.statusCode);
          } else {
            // request 응답 성공 시
            $ = cheerio.load(data);
            console.log(data);
            $('busRouteInfoItem').each(function(){
              let startStationName = $(this).find('startStationName').text();
              let endStationName = $(this).find('endStationName').text();
              let upFirstTime = $(this).find('upFirstTime').text();
              let upLastTime = $(this).find('upLastTime').text();

              result.push({
                'region': list[i].region,
                'id': list[i].id,
                'name': list[i].name,
                'typeName': list[i].typeName,
                'typeCode': list[i].typeCode,
                'startStationName': startStationName,
                'endStationName': endStationName,
                'upFirstTime': upFirstTime,
                'upLastTime': upLastTime
              });
            });
            console.log(0, list[i].id, result, '처리 완료');
            recursionRequest(i + 1, result);
          }
        });
      }
    }
    recursionRequest(0, []);
  });
}

module.exports = {
  main: master,
  updateBus: updateBus,
  updateBusDetail: updateBusDetail
};