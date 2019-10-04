/* HTML 템플릿 */
let header = `<!doctype html>
<html>
<head>
  <title>버스야 어디있니?</title>
  <meta charset="utf-8">
</head>
<body>`;
let footer = `</body>
</html>`;

/* 버스 API 준비 */
let request = require('request');
let cheerio = require('cheerio');

let API = require('./config/api.json');

const URL = API.URL;
const KEY = API.KEY;
/////
let userLati = 37.3898582;
let userLong = 126.9484383;
let message = `&x=${userLong}&y=${userLati}`;
/////
let api_url = `${URL}?serviceKey=${KEY}${message}`;


/* 웹 화면 생성 */
let http = require('http');
let fs = require('fs');
let url = require('url');
let app = http.createServer(function(_request,response){
  var _url = _request.url;
  var pathname = url.parse(_url, true).pathname;
  
  if(pathname === '/'){

    /* API DATA 요청 */
    request(api_url, function(err, res, body){ // body = xml 내용
      $ = cheerio.load(body);
    let windowmessage = `${header}<h1>당신의 위치는 ${userLati}, ${userLong} 입니다.</h1><div>가장 가까운 정류소는<ol>`;
      $('busStationAroundList').each(function(i){
        let name = $(this).find('stationName').text();
        let code = $(this).find('mobileNo').text();
        console.log(`${i}: ${name}, ${code}\n`);
        windowmessage += `<li>${name}, ${code}</li>`;
      });
      windowmessage += `</ol>${footer}`;
      response.writeHead(200);
      response.end(windowmessage);
    });

    // response.end(fs.readFileSync(__dirname + '/index.html'));
  } else {
    response.writeHead(404);
    response.end('Not found');
  }
});
app.listen(3000);