const bmConfig = require('../config/bmConfig');
const request = require("request");
const log4js = require('log4js');

const logger = log4js.getLogger();
logger.level = 'debug';

const APIServices = function() {

    fileToText = function(formData) {
        return new Promise((resolve, reject) => {
            var options = {
                method: 'POST',
                url: bmConfig.URL_API_SERVICES,
                formData
            };
            request(options, function(error, response, body) {
                if (error) {
                    logger.error('Helpers.js - APIServices.js - fileToText - Error: ', error);
                    resolve({
                        success: false,
                        return: error
                    });
                } else if (response.statusCode == 200) {
                    resolve({
                        success: true,
                        return: body
                    });
                } else {
                    logger.error('Helpers.js - APIServices.js - fileToText - Error: ', error);
                    resolve({
                        success: false,
                        return: body
                    });
                };
            });
        });
    }

    return {
        fileToText
    }
};

module.exports = APIServices;