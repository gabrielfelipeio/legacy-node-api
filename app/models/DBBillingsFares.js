const mongoose = require('mongoose');

const DBBillingsFaresSchema = new mongoose.Schema({
    organizationId: String,
    fares: Array
});

const BillingsFaresModel = mongoose.databases.Pj002.model(
    "db_billings_fares",
    DBBillingsFaresSchema
);

module.exports = BillingsFaresModel;