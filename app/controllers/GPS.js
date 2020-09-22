var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';
// REGEX GPS
const regexGPSPrincipal = /GUIA DA PREVIDÊNCIA SOCIAL/;
// REGEX CODIGO DE BARRAS 
const regexCodigoPrincipal = /\d{11}-\d{1} +\d{11}-\d{1} +\d{11}-\d{1} +\d{11}-\d{1}/;
// REGEX CNJ 
const regexCNJMASK = /\d{7}-\d{2}\.\d{4}\.\d{1}\.\d{2}\.\d{4}/;
// REGEX NOME OU RAZAO SOCIAL
const regexRazao1 = /7\.\n *.*LTDA/;
const regexRazao2 = /VALOR INSS\n *.*ME/;
// REGEX DATA VENCIMENTO
const regexData = /\d{2}\/\d{2}\/\d{2,4}/;
// REGEX NOME BENEFICIARIO
const regexNomeBen1 = /AUTENTICAÇÃO BANCÁRIA\n\D*Proc/;
const regexNomeBen2 = /\,\d{2}\nINSS.*\d{2}\./;
// REGEX CODIGO PAGAMENTO
const regexCodigoPag = /PAGAMENTO +\d{4}/;
// REGEX COMPETENCIA
const regexCompet1 = /COMPETÊNCIA +\d{2}\-\d{4}/;
const regexCompet2 = /COMPETÊNCIA +\d{2}\/\d{4}/;
// REGEX IDENTIFICADOR & TIPO IDENTIFICACAO DO CONTRIBUINTE
const regexIdent1 = /\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}/; //CNPJ
const regexIdent2 = /\d{3}\.\d{3}\.\d{3}\-\d{2}/; //CPF
const regexIdent3 = /\d{3}\.\d{5}\.\d{2}[\.-]\d{1}/; //NIT|PIS|PASEP
const regexIdent4 = /\d{2}\.\d{5}\.\d{2}\.\d{2}/; //CEI
// REGEX VALOR INSS
const regexValorINSS1 = /VALOR DO INSS +.*,\d{2}\n/;
const regexValorINSS2 = /TELEFONE *.*\,\d{2}/;
// REGEX VALOR TOTAL
const regexValorTotal1 = /TOTAL +.*,\d{2}\n/;
const regexValorTotal2 = /TOTAL\n +R\$ +.*,\d{2}\n/;

const GPS = () => {

    processing = async function(textoGuia, response) {
        try {
            let test = regexGPSPrincipal.test(textoGuia);
            if (test == false) {
                response.flag = false;
                response.Tipo = '';
                response.CNJDiferente = 'N';
                response.NumeroCodigoBarras = '';
                response.TipoGuia = '';
                response.NomeRazaoSocial = '';
                response.NomeContribuinte = '';
                response.DataVencimento = '';
                response.NomeBeneficiario = '';
                response.CodigoPagamento = '';
                response.Competencia = '';
                response.Identificador = '';
                response.IdentificacaoContribuinte = '';
                response.ValorTotal = 0;
                response.ValorINSS = 0;
                return response;
            } else {
                // CODIGO BARRAS - OK
                let codicoBarras = regexCodigoPrincipal.exec(textoGuia);
                let codigoLimpo = '';
                if (codicoBarras != null) {
                    codigoLimpo = codicoBarras[0].replace(/ /g, '').replace(/-/g, '');
                }
                // TIPO DE GUIA - OK
                let tipoGuia = 'GPS';
                // NOME OU RAZAO SOCIAL - OK
                let nomeRazaoSocial = '';
                let listaRazao1 = regexRazao1.exec(textoGuia);
                if (listaRazao1 != null) nomeRazaoSocial = listaRazao1[0].replace(/7\.\n/, '').trim();
                let listaRazao2 = regexRazao2.exec(textoGuia);
                if (listaRazao2 != null) nomeRazaoSocial = listaRazao2[0].replace(/VALOR INSS\n/, '').trim();
                // DATA VENCIMENTO - OK
                let listaData = regexData.exec(textoGuia);
                let dataVencimento = '';
                if (listaData != null) {
                    dataVencimento = listaData[0];
                }
                // NOME BENEFICIARIO - OK
                let nomeBeneficiario = 'Previdencia Social';
                // NOME CONTRIBUINTE - OK
                let nomeContribuinte = '';
                let listaNomeBeneficiario = [];
                let listaNomeBen1 = regexNomeBen1.exec(textoGuia);
                if (listaNomeBen1 != null) listaNomeBeneficiario.push(listaNomeBen1[0].replace(/AUTENTICAÇÃO BANCÁRIA\n/, '').replace(/Proc/, '').trim());
                let listaNomeBen2 = regexNomeBen2.exec(textoGuia);
                if (listaNomeBen2 != null) listaNomeBeneficiario.push(listaNomeBen2[0].replace(/\,\d{2}\n/, '').replace(/\d{2}\./, '').trim());
                let arrNomeBeneficiario = listaNomeBeneficiario.filter(function(elem, i, array) { return array.indexOf(elem) === i; });
                if (arrNomeBeneficiario.length != 0) {
                    nomeContribuinte = arrNomeBeneficiario[0].replace("INSS – ", '');
                } else {
                    nomeContribuinte = '';
                };
                // CODIGO PAGAMENTO - OK
                let codigoPagamento = '';
                let listaCodigoPag = regexCodigoPag.exec(textoGuia);
                if (listaCodigoPag != null) codigoPagamento = listaCodigoPag[0].replace(/PAGAMENTO +/, '');
                // COMPETENCIA - OK
                let competencia = '';
                let listaCompet1 = regexCompet1.exec(textoGuia);
                if (listaCompet1 != null) competencia = listaCompet1[0].replace(/COMPETÊNCIA +/, '').replace(/\-/g, '');
                let listaCompet2 = regexCompet2.exec(textoGuia);
                if (listaCompet2 != null) competencia = listaCompet2[0].replace(/COMPETÊNCIA +/, '').replace(/\//g, '');
                // IDENTIFICADOR & TIPO IDENTIFICACAO DO CONTRIBUINTE - OK
                let identificador = '';
                let tipoIdentificacaoContribuinte = "";
                let listaIdent1 = regexIdent1.exec(textoGuia);
                if (listaIdent1 != null) {
                    identificador = listaIdent1[0].replace(/\./g, '').replace(/\//g, '').replace(/\-/g, '');
                    tipoIdentificacaoContribuinte = 'CNPJ';
                };
                let listaIdent2 = regexIdent2.exec(textoGuia);
                if (listaIdent2 != null) {
                    identificador = listaIdent2[0].replace(/\./g, '').replace(/\//g, '').replace(/\-/g, '');
                    tipoIdentificacaoContribuinte = 'CPF';
                };
                let listaIdent3 = regexIdent3.exec(textoGuia);
                if (listaIdent3 != null) {
                    identificador = listaIdent3[0].replace(/\./g, '').replace(/\//g, '').replace(/\-/g, '');
                    tipoIdentificacaoContribuinte = 'NIT|PIS|PASEP';
                };
                let listaIdent4 = regexIdent4.exec(textoGuia);
                if (listaIdent4 != null) {
                    identificador = listaIdent4[0].replace(/\./g, '').replace(/\//g, '').replace(/\-/g, '');
                    tipoIdentificacaoContribuinte = 'CEI';
                };
                // VALOR TOTAL - OK
                let valorBoleto = 0;
                let listaValorTotal1 = regexValorTotal1.exec(textoGuia);
                if (listaValorTotal1 != null) {
                    valorBoleto = parseFloat(listaValorTotal1[0].replace(/TOTAL/, '').replace(/\n/, '').trim().replace(/\./g, '').replace(',', '.'));
                };
                let listaValorTotal2 = regexValorTotal2.exec(textoGuia);
                if (listaValorTotal2 != null) {
                    valorBoleto = parseFloat(listaValorTotal2[0].replace(/TOTAL\n +R\$/, '').replace(/\n/, '').trim().replace(/\./g, '').replace(',', '.'));
                };
                // VALOR INSS - OK
                let valorINSS = 0;
                let listaValorINSS1 = regexValorINSS1.exec(textoGuia);
                if (listaValorINSS1 != null) {
                    valorINSS = parseFloat(listaValorINSS1[0].replace(/VALOR DO INSS/, '').replace(/\n/, '').replace(/[rR]/g, '').replace(/[$sS]/g, '').trim().replace(/\./g, '').replace(',', '.'));
                };
                let listaValorINSS2 = regexValorINSS2.exec(textoGuia);
                if (listaValorINSS2 != null) {
                    valorINSS = parseFloat(listaValorINSS2[0].replace(/TELEFONE/, '').trim().replace(/\./g, '').replace(',', '.'));
                };
                // CNJ - OK
                let cnjEncontrado = '';
                let listaCNJs = [];
                let listaCNJMASK = textoGuia.match(regexCNJMASK);
                if (listaCNJMASK != null) listaCNJMASK.forEach(element => { listaCNJs.push(element.replace(/\./g, '').replace(/\-/g, '')); });
                let arrCNJsEncontrados = listaCNJs.filter(function(elem, i, array) { return array.indexOf(elem) === i; });
                if (arrCNJsEncontrados.length != 0) {
                    cnjEncontrado = arrCNJsEncontrados[0];
                } else {
                    cnjEncontrado = '';
                };
                // SAIDAS - OK
                let numeroProcessoRecebido = response.NumeroProcesso.replace(/\./g, '').replace(/\-/g, '');
                if (cnjEncontrado != '') { if (numeroProcessoRecebido != cnjEncontrado) { response.CNJDiferente = 'S'; } };
                response.flag = true;
                response.Tipo = 'GPS';
                response.NumeroCodigoBarras = codigoLimpo;
                response.TipoGuia = tipoGuia;
                response.NomeRazaoSocial = nomeRazaoSocial;
                response.NomeContribuinte = nomeContribuinte;
                response.DataVencimento = dataVencimento;
                response.NomeBeneficiario = nomeBeneficiario;
                response.CodigoPagamento = codigoPagamento;
                response.Competencia = competencia;
                response.Identificador = identificador;
                response.IdentificacaoContribuinte = tipoIdentificacaoContribuinte;
                response.ValorTotal = valorBoleto;
                response.ValorINSS = valorINSS;
                return response;
            }
        } catch (error) {
            logger.error('GPS.js - processing ', error);
            return error;
        }
    };

    return {
        processing: processing
    };
};

module.exports = GPS