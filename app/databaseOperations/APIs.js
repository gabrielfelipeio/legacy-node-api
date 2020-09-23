const log4js = require('log4js');

// Models
const DBAPIs = require('../models/DBAPIs')();

const logger = log4js.getLogger();
logger.level = 'debug';

const APIs = function() {

    async function getURLService(request) {
        return new Promise(async(resolve, reject) => {
            try {
                let organizationId = request.organizationid;
                let organizationIdText = organizationId.toString();
                let serviceName = request.serviceName;
                let serviceNameText = serviceName;
                let integrationCodesObject = await DBAPIs.findOne({ organizationId: organizationIdText });
                if (!integrationCodesObject) {
                    logger.error('Cliente não autorizado!');
                    resolve({
                        success: false,
                        url: '',
                        message: 'Cliente não autorizado!'
                    });
                } else {
                    resolve({
                        success: integrationCodesObject.integrationCodes.get(serviceNameText) ? true : false,
                        url: integrationCodesObject.integrationCodes.get(serviceNameText) ? integrationCodesObject.integrationCodes.get(serviceNameText) : "",
                        message: integrationCodesObject.integrationCodes.get(serviceNameText) ? "Código integração válido - URL service encontrada!" : 'Código integração inválido - URL service não encontrada!'
                    });
                };
            } catch (error) {
                logger.error('databaseOperations - APIs.js - getURLService ', err);
                reject(error);
            }
        });
    };

    return {
        getURLService
    };
};

module.exports = APIs;