let main = function(req, res) {
  res.render('main', { title: '버스야 어디가니?' });
}

let loading = function(req, res) {
  getBusList().then(function(result){
    res.send(result);
  }).catch(function(code){
    res.send('오류 발생');
  });
}

let searchBus = function(req, res) {
  res.render('search-bus', { title: '버스야 어디가니? > 버스 검색' });
}

let supportBus = function(req, res) {
  getBusList().then(function(result){
    console.log(result);
    res.render('support-bus', { title: '버스야 어디가니? > 지원하는 버스 목록', busList: result });
  }).catch(function(code){
    res.render('error', { message: code });
  });
}

/* 페이지 접속 시 버스 노선 목록 가져오기 */
function getBusList(){
  return new Promise(function (resolve, reject) {
    let request = require('request');
    let cheerio = require('cheerio');
    let API = require('../config/api.json');

    function recursionRequest(count = 1, result = []){
      if(count > 9){
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

module.exports = {
  main: main,
  loading: loading,
  searchBus: searchBus,
  supportBus: supportBus
};