const express = require('express');
const Store = require('../models/store');
const authenticate = require('../authenticate');
const cors = require('./cors');

const storeRouter = express.Router();

storeRouter
    .route('/')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, (req, res, next) => {
        Store.find()
            .then((stores) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(stores);
            })
            .catch((err) => next(err));
    })
    .post(
        cors.corsWithOptions,
        authenticate.verifyUser,
        authenticate.verifyAdmin,
        (req, res, next) => {
            Store.create(req.body)
                .then((store) => {
                    console.log('Store Item Created ', store);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(store);
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
            res.end('PUT operation not supported on /stores');
        }
    )
    .delete(
        cors.corsWithOptions,
        authenticate.verifyUser,
        authenticate.verifyAdmin,
        (req, res, next) => {
            Store.deleteMany()
                .then((response) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(response);
                })
                .catch((err) => next(err));
        }
    );

storeRouter
    .route('/:storeId')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, (req, res, next) => {
        Store.findById(req.params.storeId)
            .then((store) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(store);
            })
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end(
            `POST operation not supported on /stores/${req.params.storeId}`
        );
    })
    .put(
        cors.corsWithOptions,
        authenticate.verifyUser,
        authenticate.verifyAdmin,
        (req, res, next) => {
            Store.findByIdAndUpdate(
                req.params.storeId,
                {
                    $set: req.body
                },
                { new: true }
            )
                .then((store) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(store);
                })
                .catch((err) => next(err));
        }
    )
    .delete(
        cors.corsWithOptions,
        authenticate.verifyUser,
        authenticate.verifyAdmin,
        (req, res, next) => {
            Store.findByIdAndDelete(req.params.storeId)
                .then((response) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(response);
                })
                .catch((err) => next(err));
        }
    );

module.exports = storeRouter;
