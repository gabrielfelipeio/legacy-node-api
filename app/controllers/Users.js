const log4js = require('log4js');

const logger = log4js.getLogger();
logger.level = 'debug';

// DatabaseOperations
const UsersDatabaseOperations = require('../databaseOperations/Users')();

module.exports = function() {

    const controller = {
        async addUser(req, res) {
            try {
                let newUser = req.body;
                newUser = await UsersDatabaseOperations.add(newUser);
                return res.status(201).json(newUser);
            } catch (error) {
                logger.error('controllers - Access.js - addUser - Error:', error);
                res.status(500).send(error);
            }
        },

        async seachUserByEmail(req, res) {
            try {
                let { email } = req.params;
                user = await UsersDatabaseOperations.findByEmail(email);
                return res.json(user);
            } catch (error) {
                logger.error('controllers - Access.js - seachUser - Error:', error);
                res.status(500).send(error);
            }
        },

        async updateUser(req, res) {
            try {
                let updateUser = req.body;
                user = await UsersDatabaseOperations.update(updateUser);
                return res.json(user);
            } catch (error) {
                logger.error('controllers - Access.js - seachUser - Error:', error);
                res.status(500).send(error);
            }
        }
    };

    return controller;
};