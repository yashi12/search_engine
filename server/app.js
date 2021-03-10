const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const apiAuthRouter = require('./routes/api/auth');
const apiUserRouter = require('./routes/api/users');
const apiSkillRouter = require('./routes/api/skill');
const apiProfileRouter = require('./routes/api/profile');
const apiPostRouter = require('./routes/api/posts');

const connectDB = require('./db');

const app = express();
//Connect Database
connectDB();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Define Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/api/users',apiUserRouter);
app.use('/api/auth',apiAuthRouter);
app.use('/api/profile',apiProfileRouter);
app.use('/api/skill',apiSkillRouter);
app.use('/api/posts',apiPostRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404)); //Not Found
});

// error handler
app.use((err, req, res, next)=> {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
