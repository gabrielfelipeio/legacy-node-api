const log4js = require('log4js');
const base64en = require('file-base64');

// Database Operations
const DatabaseOperationsClients = require('../databaseOperations/Clients')();
const BillingsDatabaseOperations = require('../databaseOperations/Billings')();
// Controllers
const ProcessingGuides = require('../controllers/ProcessingGuides')();

const logger = log4js.getLogger();
logger.level = 'debug';

module.exports = function() {

    const controller = {

        async request(req, res) {
            logger.info('controllers - Guides.js - Start request function!');
            try {
                if (req.file == undefined) {
                    res.status(400).send('arquivo obrigatorio');
                    return;
                };

                let base64 = '';
                base64en.encode(req.file.path, function(err, base64String) {
                    base64 = base64String;
                });

                if (req.file.mimetype != 'application/pdf') {
                    res.status(400).send('favor enviar PDF eletronico');
                    return;
                };

                let parameters = JSON.parse(req.body.parametros);
                if ((parameters.organizationid == undefined || parameters.organizationid == "") ||
                    (parameters.numeroprocesso == undefined || parameters.numeroprocesso == "") ||
                    (parameters.processoid == undefined || parameters.processoid == "")) {
                    res.status(400).send('parameters obrigatorios');
                    return;
                };

                let clientAuthorized = await DatabaseOperationsClients.isActive(parameters.organizationid);
                if (clientAuthorized == false) {
                    res.status(401).send('cliente nao autorizado');
                    return;
                };

                let processingReturn = await ProcessingGuides.processing(base64, parameters.organizationid, parameters.numeroprocesso, parameters.processoid, __dirname + `/../../assets/uploads/${req.file.originalname}`, false);
                if (processingReturn.success == true) {
                    logger.info('controllers - Guides.js - End request function!');
                    res.setHeader("Access-Control-Allow-Origin", "*");
                    res.send(processingReturn.return);
                    return
                } else {
                    logger.info('controllers - Guides.js - End request function!');
                    res.status(406).send(processingReturn.return);
                    return
                };
            } catch (error) {
                logger.error('controllers - Guides.js - request - Error:', error);
                return res.status(500).send(error);
            };
        },

        async exportInvoice(req, res) {
            logger.info('controllers - Guides.js - Start exportInvoice function!');
            try {
                let { organizationId, initialDate, finalDate, fileName } = req.body;
                let clientAuthorized = await DatabaseOperationsClients.isActive(organizationId);
                if (!clientAuthorized) {
                    res.status(401).send('cliente nao autorizado');
                    return;
                };
                if (fileName.length == 0) {
                    res.status(400).send("Nome do arquivo invalido");
                    return;
                };
                let extractResult = await ProcessingGuides.extractInvoice(organizationId, initialDate, finalDate, fileName);
                if (extractResult.success == false) {
                    res.status(400).send(extractResult.return);
                } else {
                    res.status(200).download(__dirname + "/../../assets/invoices/" + fileName + ".csv", fileName + ".csv");
                    logger.info('controllers - Guides.js - End exportInvoice function!');
                };
            } catch (error) {
                logger.error('controllers - Guides.js - exportInvoice - Error:', error);
                return res.status(500).send(error);
            };
        },

        async testRequest(req, res) {
            logger.info('controllers - Guides.js - Start testRequest function!');
            try {
                if (req.file == undefined) {
                    res.status(400).send('arquivo obrigatorio');
                    return;
                };

                let base64 = '';
                base64en.encode(req.file.path, function(err, base64String) {
                    base64 = base64String;
                });

                if (req.file.mimetype != 'application/pdf') {
                    res.status(400).send('favor enviar PDF eletronico');
                    return;
                };

                let parameters = JSON.parse(req.body.parametros);
                if ((parameters.organizationid == undefined || parameters.organizationid == "") ||
                    (parameters.numeroprocesso == undefined || parameters.numeroprocesso == "") ||
                    (parameters.processoid == undefined || parameters.processoid == "")) {
                    res.status(400).send('parameters obrigatorios');
                    return;
                };

                let clientAuthorized = await DatabaseOperationsClients.isActive(parameters.organizationid);
                if (clientAuthorized == false) {
                    res.status(401).send('cliente nao autorizado');
                    return;
                };

                let processingReturn = await ProcessingGuides.processing(base64, parameters.organizationid, parameters.numeroprocesso, parameters.processoid, __dirname + `/../../assets/uploads/${req.file.originalname}`, true);
                if (processingReturn.success == true) {
                    logger.info('controllers - Guides.js - End testRequest function!');
                    res.setHeader("Access-Control-Allow-Origin", "*");
                    res.send(processingReturn.return);
                    return
                } else {
                    logger.info('controllers - Guides.js - End testRequest function!');
                    res.status(406).send(processingReturn.return);
                    return
                };
            } catch (error) {
                logger.error('controllers - Guides.js - testRequest - Error:', error);
                return res.status(500).send(error);
            };
        },

        async billings(req, res) {
            logger.info('controllers - Guides.js - billings - Start request function!');
            try {
                let { id } = req.body;
                if (!id) return res.status(400).send('id invalido');
                let billingsReturn = await BillingsDatabaseOperations.insertBillings(id);
                return res.status(200).send(billingsReturn);
            } catch (error) {
                logger.error('controllers - Guides.js - billings - Error:', error);
                return res.status(500).send(error);
            };
        }
    };

    return controller;
};