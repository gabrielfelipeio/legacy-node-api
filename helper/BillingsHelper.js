const request = require('request');
const bmConfig = require('../config/bmConfig');
const log4js = require('log4js');
const logger = log4js.getLogger();
logger.level = 'debug';

const Billings = () => {

    sendBillings = async function (id, billingsData) {
        return new Promise(async (resolve, reject) => {
            try {
                var options = {
                    method: 'POST',
                    url: bmConfig.URL_BILLINGS,
                    body: {
                        service: "PJ002",
                        id,
                        billingsData
                    },
                    json: true
                };
                request(options, function (error, response, body) {
                    if (error) {
                        resolve({
                            success: false,
                            return: error
                        });
                    } else if (body.status == 200) {
                        resolve({
                            success: true,
                            return: "OK"
                        });
                    } else {
                        resolve({
                            success: false,
                            return: "ERROR"
                        });
                    };
                });
            } catch (error) {
                logger.error("Helpers - BillingsHelper.js - sendBillings - Error:", error);
                reject(error);
            }
        })
    };

    return {
        sendBillings
    };
};
module.exports = Billings;