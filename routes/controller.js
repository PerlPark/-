let available = function(req, res) {
  getBusList().then(function(result){
    res.render('bus-list', { title: '지원하는 버스 목록', busList: result });
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
  available: available
};