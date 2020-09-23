const express = require('express');
const router = express.Router();

// Auth
const auth = require('../../config/auth').auth;

// Controllers
const Users = require('../controllers/Users')();

module.exports = function(app) {
    const controller = Users;

    router.post('/addUser', auth.authenticate, controller.addUser);
    router.get('/searchUserByEmail/:email', auth.authenticate, controller.seachUserByEmail);
    router.put('/updateUser', auth.authenticate, controller.updateUser);

    app.use('/api/Users', router);
};