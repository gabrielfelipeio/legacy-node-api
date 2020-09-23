const log4js = require('log4js');

const loginAuth = require('../../config/auth').login;

const logger = log4js.getLogger();
logger.level = 'debug';

// DatabaseOperations
const AccessRulesDatabaseOperations = require('../databaseOperations/AccessRules')();

module.exports = function() {

    const controller = {
        async login(req, res) {
            try {
                let { email, password } = req.body;
                console.log(req.body);
                loginAuth(email, password, result => (result.auth) ? res.json(result) : res.status(401).json(result));
            } catch (error) {
                logger.error('controllers - Access.js - login - Error:', error);
                res.status(500).send(error);
            }

        },

        async getUser(req, res) {
            try {
                res.send(req.user);
            } catch (error) {
                logger.error('controllers - Access.js - getUser - Error:', error);
                res.status(500).send(error);
            }

        },

        async validateToken(req, res) {
            try {
                res.status(200).end();
            } catch (error) {
                logger.error('controllers - Access.js - validateToken - Error:', error);
                res.status(500).send(error);
            }

        },

        async getServices(req, res) {
            try {
                const services = await AccessRulesDatabaseOperations.listAll();
                return res.json(services);
            } catch (error) {
                logger.error('controllers - Access.js - getServices - Error:', error);
                res.status(500).send(error);
            }
        }
    };

    return controller;
};