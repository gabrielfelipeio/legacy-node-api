const log4js = require('log4js');
// Helpers
const BillingsHelper = require('../../helper/BillingsHelper')();
// DatabaseOperations
const ClientsDatabaseOperations = require('../databaseOperations/Clients')();
const BillingsDatabaseOperations = require('../databaseOperations/Billings')();
const BillingsFaresDatabaseOperations = require('../databaseOperations/BillingsFares')();
const GuidesDatabaseOperations = require('../databaseOperations/Guides')();
const GuiasDatabaseOperations = require('../databaseOperations/Guias')();

const logger = log4js.getLogger();
logger.level = 'debug';

const ExportBillings = () => {

    billings = async function () {
        return new Promise(async (resolve, reject) => {
            try {
                // if (new Date().getDate() == 21) {
                let billing = await BillingsDatabaseOperations.getBilling();
                if (billing) {
                    logger.info('controllers - ExportBillings.js - billings - Init billing - Id:', billing._id);
                    let clientsResume = [];
                    let clients = await ClientsDatabaseOperations.listClients();
                    for (let i = 0; i < clients.length; i++) {
                        const client = clients[i];
                        let billingsFares = await BillingsFaresDatabaseOperations.getFares(client.organizationId);
                        let valueByGuide = 0;
                        // let obtainedGuides = await GuidesDatabaseOperations.getProcessedGuides(client.organizationId);
                        let obtainedGuides = await GuiasDatabaseOperations.getProcessedGuides(client.organizationId);
                        let finalObtainedGuides = [];
                        for (let j = 0; j < obtainedGuides.length; j++) {
                            const obtainedGuide = obtainedGuides[j];
                            if (obtainedGuide.TipoCodigo != "") {
                                obtainedGuide.NumeroProcesso = "'" + obtainedGuide.NumeroProcesso + "'";
                                obtainedGuide.NumeroCodigoBarras = "'" + obtainedGuide.NumeroCodigoBarras + "'";
                                finalObtainedGuides.push(obtainedGuide);
                            };
                        };
                        let qtyGuides = finalObtainedGuides.length;
                        valueByGuide = calcValueFare(billingsFares.fares, qtyGuides);
                        clientsResume.push({
                            clientName: client.name,
                            qtyGuides,
                            guidesValueUnitary: valueByGuide,
                            guidesValue: valueByGuide * qtyGuides,
                            processingDetails: JSON.stringify(finalObtainedGuides)
                        });
                    };
                    await BillingsDatabaseOperations.updateBilling(billing._id, clientsResume);
                    logger.info('controllers - ExportBillings.js - billings - End billing - Id:', billing._id);
                };
                // };
            } catch (error) {
                console.log(error);
                resolve(error)
            };
        });
    };

    calcValueFare = function (fares, qtyGuides) {
        let valueByGuide = null;
        for (let i = 0; i < fares.length; i++) {
            const fare = fares[i];
            if (!fare.qtyMax) valueByGuide = fare.fareValue;
            else if (qtyGuides >= fare.qtyMin && qtyGuides <= fare.qtyMax) valueByGuide = fare.fareValue;
            if (valueByGuide) return valueByGuide;
        };
        return 0;
    };

    sendBillingsToGlobal = async function () {
        return new Promise(async (resolve, reject) => {
            try {
                let billingPendingToReturn = await BillingsDatabaseOperations.getPendingBillingToReturn();
                if (billingPendingToReturn) {
                    logger.info('databaseOperations - ExportBillings.js - sendBillingsToGlobal - Init billing - Id:', billingPendingToReturn._id);
                    let returnSendBilling = await BillingsHelper.sendBillings(billingPendingToReturn.globalIdentifier, billingPendingToReturn.billingData);
                    if (returnSendBilling.success) await BillingsDatabaseOperations.updatePendingBillingToReturn(billingPendingToReturn._id);
                    logger.info('databaseOperations - ExportBillings.js - sendBillingsToGlobal - End billing - Id:', billingPendingToReturn._id);
                };
                resolve('OK')
            } catch (error) {
                logger.error('controllers - ExportBillings - sendBillingsToGlobal  - Error: ', error);
                resolve(error);
            };
        });
    };

    return {
        billings,
        sendBillingsToGlobal
    };
};
module.exports = ExportBillings;