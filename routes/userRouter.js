const express = require('express');
const User = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate');
const cors = require('./cors');

const userRouter = express.Router();

userRouter.options('*', cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
});

userRouter.get(
    '/',
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
        User.find()
            .then((users) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(users);
            })
            .catch((err) => next(err));
    }
);

userRouter.post('/signup', cors.corsWithOptions, (req, res) => {
    User.register(
        new User({ username: req.body.username }),
        req.body.password,
        (err, user) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({ err });
            } else {
                if (req.body.firstname) {
                    user.firstname = req.body.firstname;
                }
                if (req.body.lastname) {
                    user.lastname = req.body.lastname;
                }
                user.save((err) => {
                    if (err) {
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({ err: err });
                        return;
                    }
                    passport.authenticate('local')(req, res, () => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({
                            success: true,
                            status: 'Registration Successful!'
                        });
                    });
                });
            }
        }
    );
});

userRouter.post('/login', cors.corsWithOptions, (req, res, next) => {
    passport.authenticate('local', (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            return res.json({
                success: false,
                status: 'Login Unsuccessful!',
                err: info
            });
        }
        req.logIn(user, (err) => {
            if (err) {
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                return res.json({
                    success: false,
                    status: 'Login Unsuccessful!',
                    err: 'Could not log in user!'
                });
            }
            const token = authenticate.getToken({ _id: user._id });
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({
                success: true,
                token: token,
                id: req.user._id,
                favorites: req.user.favorites,
                status: 'You are successfully logged in!'
            });
        });
    })(req, res, next);
});

userRouter.get(
    '/logout',
    cors.corsWithOptions,
    authenticate.verifyUser,
    (req, res, next) => {
        authenticate.getToken({ _id: req.user._id }, 0);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({
            success: true,
            status: 'You have successfully logged out!'
        });
    }
);

userRouter.get('/checkJWTtoken', cors.corsWithOptions, (req, res) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        if (!user) {
            return res.json({ status: 'JWT invalid!', success: false, err: info });
        } else {
            return res.json({ status: 'JWT valid!', success: true, user: user });
        }
    })(req, res);
});

userRouter
    .route('/favorites')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        User.findById(req.user._id)
            .then((user) => {
                if (user) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(user.favorites);
                } else {
                    err = new Error(`User ${req.user._id} not found`);
                    err.status = 404;
                    return next(err);
                }
            })
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        User.findById(req.user._id)
            .then((user) => {
                if (user) {
                    user.favorites.push(req.body);
                    user.save()
                        .then((user) => {
                            res.statusCode = 201;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(user.favorites[user.favorites.length - 1]);
                        })
                        .catch((err) => next(err));
                } else {
                    err = new Error(`User ${req.user._id} not found`);
                    err.status = 404;
                    return next(err);
                }
            })
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, (req, res) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported on /user/favorites`);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        User.findById(req.user._id)
            .then((user) => {
                if (user) {
                    user.favorites = user.favorites.filter(
                        (favorite) => favorite.campsiteId != req.body.campsiteId
                    );
                    user.save()
                        .then((user) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(user.favorites);
                        })
                        .catch((err) => next(err));
                } else {
                    err = new Error(`User ${req.user._id} not found`);
                    err.status = 404;
                    return next(err);
                }
            })
            .catch((err) => next(err));
    });

module.exports = userRouter;
