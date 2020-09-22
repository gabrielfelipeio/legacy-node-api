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

const Guides = require('../controllers/Guides')();

module.exports = function(app) {
    const controller = Guides;

    router.post('/request', upload.single('guia'), controller.request);
    router.post('/exportInvoice', controller.exportInvoice);
    router.post('/testRequest', upload.single('guia'), controller.testRequest);
    router.post('/billings', controller.billings);

    app.use('/api/Guides', router);
};