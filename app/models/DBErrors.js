const mongoose = require('mongoose');

const DBErrorsSchema = mongoose.Schema({
    organizationId: String,
    processNumber: String,
    processIdentifier: String,
    textError: String,
    base64Guide: String
});

const DBErrorsModel = mongoose.databases.Pj002.model(
    "db_errors",
    DBErrorsSchema
);

module.exports = DBErrorsModel;