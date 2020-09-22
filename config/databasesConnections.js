const bmConfig = require('./bmConfig');
const connectDatabase = require('./database');

module.exports = function () {
    let mongoose = connectDatabase(bmConfig.URL_MONGODB, 'PJ002-PRD', 'Pj002');
    mongoose = connectDatabase(bmConfig.URL_MONGODB, 'GuiasPagamento', 'GuiasPagamento');
    return mongoose;
};