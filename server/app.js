require('dotenv/config');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const multer = require('multer');

var cors = require('cors');

const apiAuthRouter = require('./routes/api/auth');
const apiUserRouter = require('./routes/api/users');
const apiSkillRouter = require('./routes/api/skill');
const apiProfileRouter = require('./routes/api/profile');
const apiPostRouter = require('./routes/api/posts');
const apiDiscussionRouter = require('./routes/api/discussion');
const apiAnswerRouter = require('./routes/api/answer');

const connectDB = require('./db');

const app = express();
const storage = multer.memoryStorage({
  destination: (req,file,callback)=>{
    callback(null,'');
  }
});

app.use(cors());

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
// app.use(multer({storage}).single('image'));

if(process.env.NODE_ENV === 'production'){
  app.use(express.static('server/Client'))
}


//Define Routes
app.use('/api/users',apiUserRouter);
app.use('/api/auth',apiAuthRouter);
app.use('/api/profile',apiProfileRouter);
app.use('/api/discussion',apiDiscussionRouter);
app.use('/api/skill',apiSkillRouter);
app.use('/api/posts',apiPostRouter);
app.use('/api/answer',apiAnswerRouter);

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
