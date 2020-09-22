const BMConfig = require('../config/bmConfig')
const rimraf = require('rimraf');
const ExportBillings = require('../app/controllers/ExportBillings')();

setInterval(() => {
    rimraf(__dirname + '../assets/uploads/*', function () {
        console.log('Uploads folder is clean!');
    });
}, 3600000);

// setInterval(async function() {
//     await ExportBillings.billings();
// }, BMConfig.TIME_EXPORT_BILLINGS);

// setInterval(async function() {
//     await ExportBillings.sendBillingsToGlobal();
// }, BMConfig.TIME_RETURN_BILLINGS);