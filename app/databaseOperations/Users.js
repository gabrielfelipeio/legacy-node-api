const log4js = require('log4js');

// Models
const UsersModel = require('../models/Users')();

// Helpers
const CustomDateHelper = require('../../helper/CustomDate')();

const logger = log4js.getLogger();
logger.level = 'debug';

const Users = function() {

    async function add({email, name, password, configurations}) {
        return new Promise(async(resolve, reject) => {
            try {
                let DBUserSchema = new UsersModel({
                    email,
                    name,
                    password,
                    configurations,
                    dateRecordFormated: CustomDateHelper.formatBr(),
                    dateRecord: new Date()
                });

                await DBUserSchema.save((err, newUser) => {
                    if (err) {
                        logger.info('databaseOperations - Users.js - add ', err);
                        throw new Error(err);
                    };
                    logger.info('databaseOperations - Users.js - add: Record entered!');
                    resolve(newUser._doc);
                });
            } catch (error) {
                logger.error('databaseOperations - Users.js - add ', error);
                reject(error);
            }
        });
    };

    async function findById(id) {
        return new Promise(async(resolve, reject) => {
            try {
                let user = await UsersModel.findById(id);
                resolve(user);
            } catch (error) {
                logger.error('databaseOperations - Users.js - findById ', error);
                reject(error);
            }
        });
    };

    async function findByEmail(email) {
        return new Promise(async(resolve, reject) => {
            try {
                let user = await UsersModel.findOne({email});
                resolve(user);
            } catch (error) {
                logger.error('databaseOperations - Users.js - findByEmail ', error);
                reject(error);
            }
        });
    };

    async function findByEmailAndPassword(email, password) {
        return new Promise(async(resolve, reject) => {
            try {
                const user = await UsersModel.findOne({email, password});
                resolve(user);
            } catch (error) {
                logger.error('databaseOperations - Users.js - findByUsernameAndPassword ', error);
                reject(error);
            }
        });
    };

    async function update({id, email, name, password, configurations}) {
        return new Promise(async(resolve, reject) => {
            try {
                await UsersModel.findOneAndUpdate({_id: id},
                    {
                        email, 
                        name,
                        password,
                        configurations
                    }, (err, newUser) => {
                        if (err) {
                            logger.info('databaseOperations - Users.js - update ', err);
                            throw new Error(err);
                        };
                        logger.info('databaseOperations - Users.js - update: Record entered!');
                        resolve(newUser._doc);
                    });
            } catch (error) {
                logger.error('databaseOperations - Users.js - update ', error);
                reject(error);
            }
        });
    };

    return {
        add,
        findById,
        findByEmail,
        findByEmailAndPassword,
        update
    };
};

module.exports = Users;