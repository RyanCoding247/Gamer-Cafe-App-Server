const cors = require('cors');

const whitelist = ['http://localhost:3000', 'http://10.0.2.2:3000', 'https://localhost:3443', 'https://react-deploy-test-376807.web.app', ];
//https://react-deploy-test-376807.web.app is the hosting URL; plug into web browser to see app run
const corsOptionsDelegate = (req, callback) => {
    let corsOptions;
    console.log('request header origin:', req.header('Origin'));
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true };
    } else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
