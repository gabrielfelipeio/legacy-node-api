const log4js = require('log4js');

// Models
const AccessRulesModel = require('../models/AccessRules')();

const logger = log4js.getLogger();
logger.level = 'debug';

const AccessRules = function() {

    async function listAll() {
        return new Promise(async(resolve, reject) => {
            try {
                let services = await AccessRulesModel.find({});
                resolve(services);
            } catch (error) {
                logger.error('databaseOperations - AccessRules.js - findById ', error);
                reject(error);
            }
        });
    };

    return {
        listAll
    };
};

module.exports = AccessRules;