const express = require('express');
const pug = require('pug');
let app = express();
/* body parser */
app.use(express.json());
/* 정적 폴더 경로 등록 */
app.use(express.static('public'));
/* 템플릿 폴더 경로 등록 & 엔진 사용 */
app.set('views', './views');
app.set('view engine','pug');
/* 라우터 */
let router = require('./routes/main');

app.use('/', router);
app.use('/position', router);
app.use('/bus', router);
app.use('/support/bus', router);

app.use('/master', router);
app.use('/master/update/bus', router);

var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('Server On!');
});