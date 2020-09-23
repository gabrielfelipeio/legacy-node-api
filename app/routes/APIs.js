const express = require('express');
const router = express.Router();
var multer = require('multer')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, __dirname + '/../../assets/uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({
    storage: storage
});

const APIs = require('../controllers/APIs')();

module.exports = function(app) {
    const controller = APIs;

    router.post('/SolicitarIntegracao', upload.any(), controller.requestIntegrationCode);

    app.use('/api', router);
};