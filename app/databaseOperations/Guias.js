const log4js = require('log4js');

// Models
const DBGuias = require('../models/DBGuias');

const logger = log4js.getLogger();
logger.level = 'debug';


const Guias = function () {

    async function getProcessedGuides(organizationId) {
        return new Promise(async (resolve, reject) => {
            try {
                let currentMonth = new Date().getMonth() + 1;
                currentMonth = currentMonth.toString().length < 2 ? `0${currentMonth}` : currentMonth;
                let currentYear = new Date().getFullYear();
                let lastMonth = new Date().getMonth() + 1 == 1 ? 12 : new Date().getMonth();
                lastMonth = lastMonth.toString().length < 2 ? `0${lastMonth}` : lastMonth;
                let lastYear = new Date().getMonth() + 1 == 1 ? new Date().getFullYear() - 1 : new Date().getFullYear();
                let obtainedGuides = await DBGuias.find({
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
                logger.error('databaseOperations - Guias.js - saveError - Error: ' + error);
                reject(error);
            };
        });
    };


    return {
        getProcessedGuides
    };
};

module.exports = Guias;