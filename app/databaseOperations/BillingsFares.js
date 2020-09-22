const log4js = require('log4js');
const DBBillingsFaresModel = require('../models/DBBillingsFares');

const logger = log4js.getLogger();
logger.level = 'debug';

const BillingsFares = function() {

    getFares = async function(organizationId) {
        return new Promise(async(resolve, reject) => {
            try {
                let fares = await DBBillingsFaresModel.findOne({ organizationId });
                resolve(fares);
            } catch (error) {
                logger.error('databaseOperations - BillingsFares.js - getFares - Error:', error);
                reject('Error while find billings rafes');
            };
        });
    };

    return {
        getFares
    };
};

module.exports = BillingsFares;