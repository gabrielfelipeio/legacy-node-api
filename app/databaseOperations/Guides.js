const log4js = require('log4js');

// Helpers
const CustomDate = require('../../helper/CustomDate')();

// Models
const DBGuides = require('../models/DBGuides');
const DBErrors = require('../models/DBErrors');

const logger = log4js.getLogger();
logger.level = 'debug';


const Guides = function () {

    async function saveProcessing(base64, extractReturn, guideText, isTest) {
        return new Promise(async (resolve, reject) => {
            try {
                var DBGuidesSchema = new DBGuides({
                    OrganizationId: extractReturn.OrganizationId,
                    NumeroProcesso: extractReturn.NumeroProcesso,
                    ProcessoId: extractReturn.ProcessoId,
                    TipoCodigo: extractReturn.Tipo,
                    CNJDiferente: extractReturn.CNJDiferente,
                    NumeroCodigoBarras: extractReturn.NumeroCodigoBarras,
                    NomeBancoInstituicao: extractReturn.NomeBancoInstituicao,
                    DataVencimento: extractReturn.DataVencimento,
                    ValorTotal: extractReturn.ValorTotal,
                    IDGuia: extractReturn.IDGuia,
                    DocumentoBeneficiciario: extractReturn.DocumentoBeneficiciario,
                    NomeBeneficiario: extractReturn.NomeBeneficiario,
                    PessoaFisica: extractReturn.PessoaFisica,
                    ChaveBanco: extractReturn.ChaveBanco,
                    Conta: extractReturn.Conta,
                    DigitoConta: extractReturn.DigitoConta,
                    Agencia: extractReturn.Agencia,
                    DigitoAgencia: extractReturn.DigitoAgencia,
                    CodOficialImposto: extractReturn.CodOficialImposto,
                    TipoGuia: extractReturn.TipoGuia,
                    IdentificacaoContribuinte: extractReturn.IdentificacaoContribuinte,
                    InscricaoEstadual: extractReturn.InscricaoEstadual,
                    NomeRazaoSocial: extractReturn.NomeRazaoSocial,
                    NomeContribuinte: extractReturn.NomeContribuinte,
                    CodigoPagamento: extractReturn.CodigoPagamento,
                    Competencia: extractReturn.Competencia,
                    Identificador: extractReturn.Identificador,
                    ValorINSS: extractReturn.ValorINSS,
                    DataRegistro: new Date(),
                    TextoGuia: guideText,
                    GuiaBase64: base64
                });
                if (isTest) {
                    resolve(DBGuidesSchema);
                } else {
                    await DBGuidesSchema.save();
                    logger.info('databaseOperations - Guides.js - saveProcessing: Guides Inserted! ' + new Date());
                    resolve(DBGuidesSchema);
                };
            } catch (error) {
                logger.error('databaseOperations - Guides.js - saveProcessing - Error: ' + error);
                reject(error);
            };
        });
    };

    async function saveError(base64, organizationIdentifier, processNumber, processIdentifier, textError, isTest) {
        return new Promise(async (resolve, reject) => {
            try {
                var DBErrorsSchema = new DBErrors({
                    organizationId: organizationIdentifier,
                    processNumber: processNumber,
                    processIdentifier: processIdentifier,
                    textError: textError,
                    base64Guide: base64
                });
                if (!isTest) {
                    await DBErrorsSchema.save();
                };
                logger.info('databaseOperations - Guides.js - saveError: Error Inserted! ' + new Date());
                resolve(DBErrorsSchema);
            } catch (error) {
                logger.error('databaseOperations - Guides.js - saveError - Error: ' + error);
                reject(error);
            };
        });
    };

    async function getProcessedGuides(organizationId) {
        return new Promise(async (resolve, reject) => {
            try {
                let currentMonth = new Date().getMonth() + 1;
                currentMonth = currentMonth.toString().length < 2 ? `0${currentMonth}` : currentMonth;
                let currentYear = new Date().getFullYear();
                let lastMonth = new Date().getMonth() + 1 == 1 ? 12 : new Date().getMonth();
                lastMonth = lastMonth.toString().length < 2 ? `0${lastMonth}` : lastMonth;
                let lastYear = new Date().getMonth() + 1 == 1 ? new Date().getFullYear() - 1 : new Date().getFullYear();
                let obtainedGuides = await DBGuides.find({
                    OrganizationId: organizationId,
                    DataRegistro: {
                        $gte: `${lastYear}-${lastMonth}-01T00:00:00.000Z`,
                        $lt: `${currentYear}-${currentMonth}-01T00:00:00.000Z`
                    }
                }, {
                    "_id": 1,
                    "OrganizationId": 1,
                    "NumeroProcesso": 1,
                    "ProcessoId": 1,
                    "TipoCodigo": 1,
                    "CNJDiferente": 1,
                    "NumeroCodigoBarras": 1,
                    "NomeBancoInstituicao": 1,
                    "DataVencimento": 1,
                    "ValorTotal": 1,
                    "IDGuia": 1,
                    "DocumentoBeneficiciario": 1,
                    "NomeBeneficiario": 1,
                    "PessoaFisica": 1,
                    "ChaveBanco": 1,
                    "Conta": 1,
                    "DigitoConta": 1,
                    "Agencia": 1,
                    "DigitoAgencia": 1,
                    "CodOficialImposto": 1,
                    "TipoGuia": 1,
                    "IdentificacaoContribuinte": 1,
                    "InscricaoEstadual": 1,
                    "NomeRazaoSocial": 1,
                    "NomeContribuinte": 1,
                    "CodigoPagamento": 1,
                    "Competencia": 1,
                    "Identificador": 1,
                    "ValorINSS": 1,
                    "DataRegistro": 1
                });
                resolve(obtainedGuides);
            } catch (error) {
                logger.error('databaseOperations - Guides.js - saveError - Error: ' + error);
                reject(error);
            };
        });
    };


    return {
        saveProcessing,
        saveError,
        getProcessedGuides
    };
};

module.exports = Guides;