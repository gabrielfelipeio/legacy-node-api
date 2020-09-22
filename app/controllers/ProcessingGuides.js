const log4js = require('log4js');
const fs = require('fs');
const Json2csvParser = require('json2csv').Parser;
const fields = ["_id", "OrganizationId", "NumeroProcesso", "ProcessoId", "TipoCodigo", "CNJDiferente", "NumeroCodigoBarras", "NomeBancoInstituicao", "DataVencimento", "ValorTotal", "IDGuia", "DocumentoBeneficiciario", "NomeBeneficiario", "PessoaFisica", "ChaveBanco", "Conta", "DigitoConta", "Agencia", "DigitoAgencia", "CodOficialImposto", "TipoGuia", "IdentificacaoContribuinte", "InscricaoEstadual", "NomeRazaoSocial", "NomeContribuinte", "CodigoPagamento", "Competencia", "Identificador", "ValorINSS", "DataRegistro"];
const opts = { 'delimiter': ';', 'doubleQuote': '\"', 'excelStrings': false, 'fields': fields };
const rimraf = require('rimraf');

// Database Operations
const DatabaseOperationsGuides = require('../databaseOperations/Guides')();

// Controllers
const CBPADRAO = require('./CBPADRAO')();
const CBGRERJ = require('./CBGRERJ')();
const CBGRCT = require('./CBGRCT')();
const CBGRU = require('./CBGRU')();
const GPS = require('./GPS')();

// Helpers
const APIServices = require('../../helper/APIServices')();

const logger = log4js.getLogger();
logger.level = 'debug';

const Guides = function() {

    async function processing(base64, organizationId, numeroProcesso, processoId, filePath, isTest) {
        return new Promise(async(resolve, reject) => {
            try {
                let formData = { myFile: await fs.createReadStream(filePath), removeImages: "true" };
                let resultConvert = await APIServices.fileToText(formData);
                if (resultConvert.success != true) {
                    await DatabaseOperationsGuides.saveError(base64, organizationId, numeroProcesso, processoId, resultConvert.return);
                    logger.error('controllers - ProcessingGuides.js - processing - Error Convert to Text:', resultConvert.return);
                    resolve(resultConvert);
                } else {
                    let textConverted = resultConvert.return;
                    let extractReturn = {
                        flag: false,
                        Tipo: '',
                        CNJDiferente: 'N',
                        OrganizationId: organizationId,
                        NumeroProcesso: numeroProcesso,
                        ProcessoId: processoId,
                        NumeroCodigoBarras: '',
                        NomeBancoInstituicao: '',
                        DataVencimento: '',
                        ValorTotal: 0,
                        IDGuia: '',
                        DocumentoBeneficiciario: '',
                        NomeBeneficiario: '',
                        PessoaFisica: '',
                        ChaveBanco: '',
                        Conta: '',
                        DigitoConta: '',
                        Agencia: '',
                        DigitoAgencia: '',
                        CodOficialImposto: '',
                        TipoGuia: '',
                        IdentificacaoContribuinte: '',
                        InscricaoEstadual: '',
                        NomeRazaoSocial: '',
                        NomeContribuinte: '',
                        CodigoPagamento: '',
                        Competencia: '',
                        Identificador: '',
                        ValorINSS: 0
                    };
                    let CBPADRAOReturn = await CBPADRAO.processing(textConverted, extractReturn);
                    if (CBPADRAOReturn.flag == true) {
                        resolve({
                            success: true,
                            return: await DatabaseOperationsGuides.saveProcessing(base64, CBPADRAOReturn, textConverted, isTest)
                        });
                    } else {
                        let CBGRERJReturn = await CBGRERJ.processing(textConverted, extractReturn);
                        if (CBGRERJReturn.flag == true) {
                            resolve({
                                success: true,
                                return: await DatabaseOperationsGuides.saveProcessing(base64, CBGRERJReturn, textConverted, isTest)
                            });
                        } else {
                            let CBGRCTReturn = await CBGRCT.processing(textConverted, extractReturn);
                            if (CBGRCTReturn.flag == true) {
                                resolve({
                                    success: true,
                                    return: await DatabaseOperationsGuides.saveProcessing(base64, CBGRCTReturn, textConverted, isTest)
                                });
                            } else {
                                let CBGRUReturn = await CBGRU.processing(textConverted, extractReturn);
                                if (CBGRUReturn.flag == true) {
                                    resolve({
                                        success: true,
                                        return: await DatabaseOperationsGuides.saveProcessing(base64, CBGRUReturn, textConverted, isTest)
                                    });
                                } else {
                                    let GPSReturn = await GPS.processing(textConverted, extractReturn);
                                    if (GPSReturn.flag == true) {
                                        resolve({
                                            success: true,
                                            return: await DatabaseOperationsGuides.saveProcessing(base64, GPSReturn, textConverted, isTest)
                                        });
                                    } else {
                                        let guideSaved = await DatabaseOperationsGuides.saveProcessing(base64, extractReturn, textConverted, isTest);
                                        await DatabaseOperationsGuides.saveError(base64, organizationId, numeroProcesso, processoId, `Unidentified guide type - Guide ObjectId: ${guideSaved._id}`);
                                        resolve({
                                            success: false,
                                            return: 'Tipo de Guia não identificada'
                                        });
                                    }
                                }
                            }
                        }
                    }
                };
            } catch (error) {
                logger.error('controllers - ProcessingGuides.js - processing - Error:', error);
                resolve({
                    success: false,
                    return: error
                });
            };
        });
    };

    async function extractInvoice(organizationId, initialDate, finalDate, fileName) {
        return new Promise(async(resolve, reject) => {
            try {
                rimraf(__dirname + "/../../assets/invoices/*", function() { console.log('Invoices folder is clean!'); });
                let formatDateIsValid = false,
                    newInitialDate, newFinalDate;
                formatDateIsValid = validateDateFormat(initialDate);
                if (formatDateIsValid) {
                    newInitialDate = formatDateForConsultation(initialDate);
                    formatDateIsValid = (newInitialDate) ? true : false;
                };
                if (!formatDateIsValid) {
                    resolve({
                        success: false,
                        return: "Data inicial com formato invalido"
                    });
                };
                formatDateIsValid = validateDateFormat(finalDate);
                if (formatDateIsValid) {
                    newFinalDate = formatDateForConsultation(finalDate, true);
                    formatDateIsValid = (newFinalDate) ? true : false;
                };
                if (!formatDateIsValid) {
                    resolve({
                        success: false,
                        return: "Data final com formato invalido"
                    });
                };
                let obtainedGuides = await DatabaseOperationsGuides.getProcessedGuides(organizationId, newInitialDate, newFinalDate, fields);
                let finalObtainedGuides = [];
                for (var i = 0; i < obtainedGuides.length; i++) {
                    const obtainedGuide = obtainedGuides[i];
                    if (obtainedGuide.TipoCodigo != "") {
                        obtainedGuide.NumeroProcesso = "'" + obtainedGuide.NumeroProcesso + "'";
                        obtainedGuide.NumeroCodigoBarras = "'" + obtainedGuide.NumeroCodigoBarras + "'";
                        finalObtainedGuides.push(obtainedGuide);
                    };
                };
                const parser = new Json2csvParser(opts);
                const csv = parser.parse(finalObtainedGuides);
                // console.log('CSV: ', csv)
                await fs.writeFileSync(__dirname + "/../../assets/invoices/" + fileName + ".csv", csv);
                resolve({
                    success: true,
                    return: 'OK'
                });


            } catch (error) {
                logger.error('controllers - ProcessingGuides.js - extractInvoice - Error:', error);
                resolve({
                    success: false,
                    return: error
                });
            };
        });
    };

    function formatDateForConsultation(date, flag = false) {
        var day = date.slice(0, 2) || 0,
            month = date.slice(3, 5) || 0,
            year = date.slice(6, 11) || 0;
        if ((day < 1 || day > 31) || (month < 1 || month > 12)) {
            return false;
        };
        return (flag) ? `${year}-${month}-${day}T23:59:59.999` : `${year}-${month}-${day}T00:00:00.000`
    };

    function validateDateFormat(date) {
        let regexDate = /^\d{2}-\d{2}-\d{4}$/;
        return new RegExp(regexDate).test(date);
    };

    return {
        processing,
        extractInvoice
    };
};

module.exports = Guides;