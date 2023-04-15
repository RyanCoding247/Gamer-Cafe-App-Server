const createError = require('http-errors');

const path = require('path');
const passport = require('passport');

const indexRouter = require('./routes/index');
const userRouter = require('./routes/userRouter');

//true routers
const menuRouter = require('./routes/menuRouter');
const gameRouter = require('./routes/gameRouter');
const eventRouter = require('./routes/eventRouter');
const roomRouter = require('./routes/roomRouter');
const storeRouter = require('./routes/storeRouter');

const uploadRouter = require('./routes/uploadRouter');

const config = require('./config');
const mongoose = require('mongoose');

// Make sure you have added your mongoDB connection string to config.js
const url = config.mongoConnectionString;

const connect = async () => {
    await mongoose.connect(url, {
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
};

connect().catch((err) => functions.logger.log(err));

const express = require('express');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/user', userRouter);

//true routes
app.use('/menu', menuRouter);
app.use('/games', gameRouter);
app.use('/events', eventRouter);
app.use('/rooms', roomRouter);
app.use('/store', storeRouter);

app.use('/imageUpload', uploadRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// // error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

exports.gamerCafeServer = app;
