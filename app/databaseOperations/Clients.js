const log4js = require('log4js');

// Models
const DBClients = require('../models/DBClients');

const logger = log4js.getLogger();
logger.level = 'debug';

const Clients = function() {

    async function isActive(organizationIdentifier) {
        return new Promise(async(resolve, reject) => {
            try {
                let client = await DBClients.findOne({ organizationId: organizationIdentifier });
                resolve(client.isActive == true ? true : false);
            } catch (error) {
                logger.error('databaseOperations - Clients.js - isActive - Error:', error);
                reject('Error while check client is active');
            };
        });
    };

    async function exists(organizationIdentifier) {
        return new Promise(async(resolve, reject) => {
            try {
                let client = await DBClients.findOne({ organizationId: organizationIdentifier });
                resolve(client == null ? false : true);
            } catch (error) {
                logger.error('databaseOperations - Clients.js - exists - Error:', error);
                reject('Error while client exists');
            };
        });
    };

    async function getClient(organizationIdentifier) {
        return new Promise(async(resolve, reject) => {
            try {
                let client = await DBClients.findOne({ organizationId: organizationIdentifier });
                resolve(client);
            } catch (error) {
                logger.error('databaseOperations - Clients.js - getClient - Error: ', error);
                reject('Error while get client');
            };
        });
    };

    async function listClients() {
        return new Promise(async(resolve, reject) => {
            try {
                let list = await DBClients.find({ isActive: true });
                resolve(list);
            } catch (error) {
                logger.error('databaseOperations - Clients.js - listClients - Error:', error);
                reject('Error while list clients');
            };
        });
    };

    return {
        isActive,
        exists,
        getClient,
        listClients
    };
};

module.exports = Clients;