const log4js = require('log4js');

// Models
const DBBillingsModel = require('../models/DBBillings');

const logger = log4js.getLogger();
logger.level = 'debug';

const Billings = function () {

    insertBillings = async function (identifier) {
        return new Promise(async (resolve, reject) => {
            try {
                let BillingsSchema = new DBBillingsModel({
                    dateRecord: new Date(),
                    globalIdentifier: identifier,
                    billingData: null,
                    sendedGlobalBilling: false,
                    dateSendedGlobalBilling: null
                });
                await BillingsSchema.save((err, data) => {
                    if (err) reject(err);
                    resolve(data.id);
                });
            } catch (error) {
                logger.error('databaseOperations - Billings.js - insertBillings - Error:', error);
                reject('Error while insert billings');
            };
        });
    };

    getBilling = async function () {
        return new Promise(async (resolve, reject) => {
            try {
                let billing = await DBBillingsModel.findOne({
                    billingData: null,
                    sendedGlobalBilling: false,
                    dateSendedGlobalBilling: null
                });
                resolve(billing);
            } catch (error) {
                logger.error('databaseOperations - Billings.js - getBilling - Error:', error);
                reject('Error while get billing');
            }
        });
    };

    updateBilling = async function (_id, billingData) {
        return new Promise(async (resolve, reject) => {
            try {
                let updatedBilling = await DBBillingsModel.findOneAndUpdate({
                    _id
                }, {
                    billingData,
                });
                resolve(updatedBilling);
            } catch (error) {
                logger.error('databaseOperations - Billings.js - updateBilling - Error:', error);
                reject('Error while update billing');
            };
        });
    };

    getPendingBillingToReturn = async function () {
        return new Promise(async (resolve, reject) => {
            try {
                let billing = await DBBillingsModel.findOne({
                    billingData: {
                        $ne: null
                    },
                    sendedGlobalBilling: false,
                    dateSendedGlobalBilling: null
                });
                resolve(billing);
            } catch (error) {
                logger.error('databaseOperations - Billings.js - getPendingBillingToReturn - Error:', error);
                reject('Error while list pending billings to return');
            }
        });
    };

    updatePendingBillingToReturn = async function(identifier) {
        return new Promise(async(resolve, reject) => {
            try {
                let updatedBillings = await DBBillingsModel.findOneAndUpdate({
                    _id: identifier
                }, {
                    sendedGlobalBilling: true,
                    dateSendedGlobalBilling: new Date()
                });
                resolve(updatedBillings);
            } catch (error) {
                logger.error('Mongo_Controller.js - updatePendingBillingToReturn - Erro: ' + error);
                reject(error);
            };
        });
    };

    return {
        insertBillings,
        getBilling,
        updateBilling,
        getPendingBillingToReturn,
        updatePendingBillingToReturn
    };
};

module.exports = Billings;