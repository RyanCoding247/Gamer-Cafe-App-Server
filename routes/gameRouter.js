const express = require('express');
const Game = require('../models/game');
const authenticate = require('../authenticate');
const cors = require('./cors');

const gameRouter = express.Router();

gameRouter
    .route('/')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, (req, res, next) => {
        Game.find()
            .then((games) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(games);
            })
            .catch((err) => next(err));
    })
    .post(
        cors.corsWithOptions,
        authenticate.verifyUser,
        authenticate.verifyAdmin,
        (req, res, next) => {
            Game.create(req.body)
                .then((game) => {
                    console.log('Game Item Created ', game);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(game);
                })
                .catch((err) => next(err));
        }
    )
    .put(
        cors.corsWithOptions,
        authenticate.verifyUser,
        authenticate.verifyAdmin,
        (req, res) => {
            res.statusCode = 403;
            res.end('PUT operation not supported on /games');
        }
    )
    .delete(
        cors.corsWithOptions,
        authenticate.verifyUser,
        authenticate.verifyAdmin,
        (req, res, next) => {
            Game.deleteMany()
                .then((response) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(response);
                })
                .catch((err) => next(err));
        }
    );

gameRouter
    .route('/:gameId')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, (req, res, next) => {
        Game.findById(req.params.gameId)
            .then((game) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(game);
            })
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end(
            `POST operation not supported on /games/${req.params.gameId}`
        );
    })
    .put(
        cors.corsWithOptions,
        authenticate.verifyUser,
        authenticate.verifyAdmin,
        (req, res, next) => {
            Game.findByIdAndUpdate(
                req.params.gameId,
                {
                    $set: req.body
                },
                { new: true }
            )
                .then((game) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(game);
                })
                .catch((err) => next(err));
        }
    )
    .delete(
        cors.corsWithOptions,
        authenticate.verifyUser,
        authenticate.verifyAdmin,
        (req, res, next) => {
            Game.findByIdAndDelete(req.params.gameId)
                .then((response) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(response);
                })
                .catch((err) => next(err));
        }
    );

module.exports = gameRouter;
