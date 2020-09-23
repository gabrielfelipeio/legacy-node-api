const express = require('express');
const router = express.Router();

// Auth
const auth = require('../../config/auth').auth;

// Controllers
const Access = require('../controllers/Access')();

module.exports = function(app) {
    const controller = Access;

    router.post('/login', controller.login);
    router.get('/validateToken', auth.authenticate, controller.validateToken)
    router.get('/rules', auth.authenticate, controller.getUser);
    router.get('/services', auth.authenticate, controller.getServices);

    app.use('/api/Access', router);
};