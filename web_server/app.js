/*
 Routing 자체는 Front에서 진행 ( metemask 같은 browser wallet 사용시 용이 )
 get method 호출시 db에 있는 정보를 이용하여 return ( IPFS Hash 값을 이용하여 IPFS에 저장된 것도 Return)
 listener를 이용하여 contract 에서 발생한 event
 */

const createError = require('http-errors');
const path = require('path');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const api_routers = require('./routes/routes');

app.use('/api/*',api_routers); // routing 처리
app.use('*', express.static('clientApp')); // const clientApp = path.join(__dirname, '../client/build')
app.listen(8888, (err)=> {
  console.log('SYSTEM: HTTP SERVER RUNNING ON 8888 PORT');
});