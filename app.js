const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');//跨域中间件
const expressJWT = require('express-jwt');//token校验
const { PRIVATE_KEY } = require('./utils/constants');
const { handlePrototype } = require('./utils/index');
const fs = require('fs');
handlePrototype();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const articleRouter = require('./routes/article');
const commentRouter = require('./routes/comment');

const app = express();

// app.key = fs.readFileSync("../2_ytionb.top.key");
// app.cert = fs.readFileSync("../1_ytionb.top_bundle.crt");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: false, limit: '50mb'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//token校验配置
app.use(expressJWT({
  secret: PRIVATE_KEY,
  algorithms: ['HS256']
}).unless({
  //校验白名单 接口路径
  path: [
    '/api/user/login',
    '/api/sendCode',
    '/api/checkCode',
    '/api/merageFace',
    '/api/enterprisePay'
  ]
}));

app.use('/api', indexRouter);
app.use('/api/user', usersRouter);
app.use('/api/article', articleRouter);
app.use('/api/comment', commentRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.log(err);
  if (err.name == 'UnauthorizedError') {
    res.status(401).send({ code: -1, msg: 'token校验失败！' });
  } else {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    
    // render the error page
    res.status(err.status || 500).send({ code: 500, msg: '未知错误！' });
    // res.render('error');
  }
});

module.exports = app;
