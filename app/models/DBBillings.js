const mongoose = require('mongoose');

const DBBillingsSchema = new mongoose.Schema({
    dateRecord: Date,
    globalIdentifier: String,
    billingData: Object,
    sendedGlobalBilling: Boolean,
    dateSendedGlobalBilling: Date
});

const DBBillingsModel = mongoose.databases.Pj002.model(
    "db_billings",
    DBBillingsSchema
);

module.exports = DBBillingsModel;