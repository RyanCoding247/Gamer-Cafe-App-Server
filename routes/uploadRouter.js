const express = require('express');
const authenticate = require('../authenticate');
const cors = require('./cors');
const { Storage } = require('@google-cloud/storage');
const { filesUpload } = require('../file-upload-middleware');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');

const storage = new Storage();
const bucket = storage.bucket(config.bucketName);

const uploadRouter = express.Router();

uploadRouter
    .route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(
        cors.cors,
        authenticate.verifyUser,
        authenticate.verifyAdmin,
        (req, res) => {
            res.statusCode = 403;
            res.end('GET operation not supported on /imageUpload');
        }
    )
    .post(
        cors.corsWithOptions,
        authenticate.verifyUser,
        filesUpload,
        async (req, res) => {
            const fileExtension = req.files[0].originalname.split('.').pop();
            const fileName = `${uuidv4()}.${fileExtension}`;
            const file = bucket.file(fileName);

            file.save(req.files[0].buffer, (err) => {
                if (!err) {
                    console.log('success?!!');
                }
            });
            const fileURL =
                'http://' + bucket + '.storage.googleapis.com/' + fileName;
            console.log('url is:', fileURL);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.json({
                success: true,
                fileURL: fileURL
            });
        }
    )
    .put(
        cors.corsWithOptions,
        authenticate.verifyUser,
        authenticate.verifyAdmin,
        (req, res) => {
            res.statusCode = 403;
            res.end('PUT operation not supported on /imageUpload');
        }
    )
    .delete(
        cors.corsWithOptions,
        authenticate.verifyUser,
        authenticate.verifyAdmin,
        (req, res) => {
            res.statusCode = 403;
            res.end('DELETE operation not supported on /imageUpload');
        }
    );

module.exports = uploadRouter;
