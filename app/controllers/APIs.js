const log4js = require('log4js');

// Database Operations
const DatabaseOperationsAPIs = require('../databaseOperations/APIs')();

const logger = log4js.getLogger();
logger.level = 'debug';

module.exports = function() {

    const controller = {

        async requestIntegrationCode(req, res) {
            logger.info('controllers - APIs.js - Start requestIntegrationCode function!');
            try {
                let request = JSON.parse(req.body.parametros);
                let databaseReturn = await DatabaseOperationsAPIs.getURLService(request);
                if (databaseReturn.success) {
                    logger.info(databaseReturn.message);
                    res.status(200).send({
                        urlService: databaseReturn.url
                    });
                } else {
                    if (databaseReturn.message == "Cliente não autorizado!") {
                        logger.error(databaseReturn.message);
                        res.status(401).send(databaseReturn.message);
                    } else {
                        logger.error(databaseReturn.message);
                        res.status(401).send(databaseReturn.message);
                    };
                };
                logger.info('controllers - APIs.js - End requestIntegrationCode function!');
            } catch (err) {
                logger.error('controllers - APIs.js - requestIntegrationCode ', err);
                res.status(500).send(err);
            };
        },
    };

    return controller;
};