var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';
// REGEX CODIGO DE BARRAS 
const regexCodigoPrincipal = /\d{12} +\d{12} +\d{12} +\d{12}/;
// REGEX CNPJ 
const CNPJParaRemover = ['00.497.373/0001-10', '00497373/0001-10', '00497373000110', '72.820.822/0001-20', '72820822/0001-20', '72820822000120', '72.820.822/0027-69', '72820822/0027-69', '72820822002769'];
const regexCNPJ1 = /\d{2}.\d{3}.\d{3}\/\d{4}-\d{2}/g;
const regexCNPJ2 = /\d{8}\/\d{4}\-\d{2}/g;
const regexCNPJ3 = /CNPJ: \d{14}/g;
const regexCNPJ4 = /     \d{14}     /g;
// REGEX CPF 
const regexCPF = /\d{3}\.\d{3}\.\d{3}\-\d{2}/g;
// REGEX CNJ 
const regexCNJMASK = /\d{7}-\d{2}\.\d{4}\.\d{1}\.\d{2}\.\d{4}/;
const regexCNJLP1 = /Instância: \d{18}/;
// REGEX ID GUIA 
const regexGuiaGRUSIMPLES = /N\º Fistel:\d{11}\n/;
const regexGuiaFEDTJ = /Pedido \d{16}/;
const regexGuiaGRCT = /\d{3}\.\d{4}\.\d{6}/;
const regexGuiaGRCT2 = /N\º Guia: *\d{3}\.\d{4}\.\d{6}/;
// REGEX NOME BENEFICIARIO 
const regexFDJ = /Justiça *\n *.*\n *Nome/;
const regexDAE2 = /.* +NUMERAÇÃO DO CÓDIGO DE BARRAS/;
const regexGRUSIMPLES = /Competência *- *\n\n.*Vencimento/;
const regexGRUSIMPLES2 = /Competência *- *\n.*Vencimento/;
const regexFEDTJ = /Justiça *\n.*\n *Nome/;
const regexGRCT1 = /Promovido:.*\n\n/;
// REGEX DATA VENCIMENTO
const regexData1 = /Guia de Recolhimento de Custas e Taxas/;
const regexData2 = /DAE - Documento de Arrecadação Estadual/;
const regexData3 = /Vencimento *\d{2}\/\d{2}\/\d{4}/;
// REGEX CODIGO OFICIAL DO IMPOSTO/RECEITA DO TRIBUTO
const regexImpostoDAE2 = /PAGAMENTO ATÉ\n.*\d{2}\/\d{2}\/\d{4}/;
const regexImpostoGRUSIMPLES = /Código do *\d{5}/;
const regexImpostoFEDJ = /Código\n.*\d{3}\-\d{1}/;
const regexImpostoCONTAFEPJA = /\d{4}\-\d{1}\/\d{3}\.\d{3}\-\d{1}/;
// REGEX TIPO DE GUIA
const regexTipoGuiaDAE = /DAE - Documento de Arrecadação Estadual/;
const regexTipoGuiaGRU = /Guia de Recolhimento da União - GRU/;
const regexTipoGuiaFEDTJ = /Fundo Especial de Despesa - FEDTJ/;
const regexTipoGuiaGRCT = /Guia de Recolhimento de Custas e Taxas/;

const CBGRCT = () => {

    processing = async function(textoGuia, response) {
        try {
            let test = regexCodigoPrincipal.test(textoGuia);
            let exec = regexCodigoPrincipal.exec(textoGuia);
            if (test == false) {
                response.flag = false;
                response.Tipo = '';
                response.CNJDiferente = 'N';
                response.NumeroCodigoBarras = '';
                response.NomeBancoInstituicao = '';
                response.DataVencimento = '';
                response.ValorTotal = 0;
                response.IDGuia = '';
                response.DocumentoBeneficiciario = '';
                response.NomeBeneficiario = '';
                response.CodOficialImposto = '';
                response.TipoGuia = '';
                response.IdentificacaoContribuinte = '';
                response.InscricaoEstadual = ''
                return response;
            } else {
                // CODIGO BARRAS - OK
                let codicoBarras = exec[0];
                let codigoLimpo = codicoBarras.replace(/ /g, '');
                let partecodigo1 = codigoLimpo.substr(0, 11);
                let partecodigo2 = codigoLimpo.substr(12, 11);
                let partecodigo3 = codigoLimpo.substr(24, 11);
                let partecodigo4 = codigoLimpo.substr(36, 11);
                codigoLimpo = partecodigo1 + partecodigo2 + partecodigo3 + partecodigo4;
                // VALOR BOLETO - OK
                let valorBoleto = parseInt(codigoLimpo.substr(4, 11));
                valorBoleto = valorBoleto.toString();
                let reais = valorBoleto.substr(0, valorBoleto.length - 2);
                let centavos = valorBoleto.substr(valorBoleto.length - 2, valorBoleto.length);
                valorBoleto = reais + '.' + centavos;
                valorBoleto = parseFloat(valorBoleto);
                // NOME BENEFICIARIO - OK
                let nomeBeneficiario = '';
                let listaNomeBeneficiario = [];
                let listaFDJ = regexFDJ.exec(textoGuia);
                if (listaFDJ != null) listaNomeBeneficiario.push(listaFDJ[0].replace(/Justiça *\n */, '').replace(/\n *Nome/, ''));
                let listaDAE2 = regexDAE2.exec(textoGuia);
                if (listaDAE2 != null) listaNomeBeneficiario.push(listaDAE2[0].replace(/ +NUMERAÇÃO DO CÓDIGO DE BARRAS/, ''));
                let listaGRUSIMPLES = regexGRUSIMPLES.exec(textoGuia);
                if (listaGRUSIMPLES != null) listaNomeBeneficiario.push(listaGRUSIMPLES[0].replace(/Competência *- *\n\n/, '').replace(/Vencimento/, ''));
                let listaGRUSIMPLES2 = regexGRUSIMPLES2.exec(textoGuia);
                if (listaGRUSIMPLES2 != null) listaNomeBeneficiario.push(listaGRUSIMPLES2[0].replace(/Competência *- *\n/, '').replace(/Vencimento/, ''));
                let listaFEDTJ = regexFEDTJ.exec(textoGuia);
                if (listaFEDTJ != null) listaNomeBeneficiario.push(listaFEDTJ[0].replace(/Justiça *\n/, '').replace(/\n *Nome/, ''));
                let listaGRCT1 = regexGRCT1.exec(textoGuia);
                if (listaGRCT1 != null) listaNomeBeneficiario.push(listaGRCT1[0].replace(/Promovido:/, '').replace(/\n\n/, ''));
                let arrNomeBeneficiario = listaNomeBeneficiario.filter(function(elem, i, array) { return array.indexOf(elem) === i; });
                if (arrNomeBeneficiario.length != 0) {
                    nomeBeneficiario = arrNomeBeneficiario[0];
                } else {
                    nomeBeneficiario = '';
                };
                // NOME BANCO/INSTATUICAO - OK
                let nomeBancoInstit = '';
                nomeBancoInstit = nomeBeneficiario;
                // DATA VENCIMENTO - OK
                let dataVencimento = '';
                let listaData1 = regexData1.exec(textoGuia);
                if (listaData1 != null) {
                    let dataBruta = codigoLimpo.substr(24, 8);
                    let ano = dataBruta.substr(0, 4);
                    let mes = dataBruta.substr(4, 2);
                    let dia = dataBruta.substr(6, 2);
                    dataVencimento = dia + "/" + mes + "/" + ano;
                };
                let listaData2 = regexData2.exec(textoGuia);
                if (listaData2 != null) {
                    let dataBruta = codigoLimpo.substr(19, 8);
                    let ano = dataBruta.substr(0, 4);
                    let mes = dataBruta.substr(4, 2);
                    let dia = dataBruta.substr(6, 2);
                    dataVencimento = dia + "/" + mes + "/" + ano;
                };
                let listaData3 = regexData3.exec(textoGuia);
                if (listaData3 != null) {
                    dataVencimento = listaData3[0].replace(/Vencimento/, '').trim();
                };
                // ID GUIA - OK
                let idGuia = '';
                let listaIdGuias = [];
                let listaGuiaGRUSIMPLES = regexGuiaGRUSIMPLES.exec(textoGuia);
                if (listaGuiaGRUSIMPLES != null) listaIdGuias.push(listaGuiaGRUSIMPLES[0].replace(/N\º Fistel:/, '').replace(/\n/, ''));
                let listaGuiaFEDTJ = regexGuiaFEDTJ.exec(textoGuia);
                if (listaGuiaFEDTJ != null) listaIdGuias.push(listaGuiaFEDTJ[0].replace(/Pedido /, ''));
                let listaGuiaGRCT = regexGuiaGRCT.exec(textoGuia);
                if (listaGuiaGRCT != null) listaIdGuias.push(listaGuiaGRCT[0]);
                let listaGuiaGRCT2 = regexGuiaGRCT2.exec(textoGuia);
                if (listaGuiaGRCT2 != null) listaIdGuias.push(listaGuiaGRCT2[0].replace(/N\º Guia: */, ''));
                let arrIdsGuias = listaIdGuias.filter(function(elem, i, array) { return array.indexOf(elem) === i; });
                if (arrIdsGuias.length != 0) {
                    idGuia = arrIdsGuias[0].trim().replace(/\./g, '').replace(/ /g, '').replace(/\-/g, '');
                } else {
                    idGuia = arrIdsGuias[0];
                }
                // DOCUMENTO BENEFICIARIO - OK
                let documentosBeneficiciario = '';
                let listaCPFs = [];
                let listaCPF = textoGuia.match(regexCPF);
                if (listaCPF != null) listaCPF.forEach(element => { listaCPFs.push(element); });
                let listaCNPJs = [];
                let listaCNPJ1 = textoGuia.match(regexCNPJ1);
                if (listaCNPJ1 != null) listaCNPJ1.forEach(element => { listaCNPJs.push(element); });
                let listaCNPJ2 = textoGuia.match(regexCNPJ2);
                if (listaCNPJ2 != null) listaCNPJ2.forEach(element => { listaCNPJs.push(element); });
                let listaCNPJ3 = textoGuia.match(regexCNPJ3);
                if (listaCNPJ3 != null) listaCNPJ3.forEach(element => { listaCNPJs.push(element.replace('CNPJ: ', '')); });
                let listaCNPJ4 = textoGuia.match(regexCNPJ4);
                if (listaCNPJ4 != null) listaCNPJ4.forEach(element => { listaCNPJs.push(element.replace(/     /, '').replace(/     /, '')); });
                let arrDocumentosBeneficiciarios = listaCNPJs.filter(function(elem, i, array) { return array.indexOf(elem) === i; });
                let arrDocumentosBeneficiciariosCPFs = listaCPFs.filter(function(elem, i, array) { return array.indexOf(elem) === i; });
                for (let i = 0; i < CNPJParaRemover.length; i++) {
                    const valueToRemove = CNPJParaRemover[i];
                    arrDocumentosBeneficiciarios = arrDocumentosBeneficiciarios.filter(item => item !== valueToRemove);
                };
                if (arrDocumentosBeneficiciarios.length != 0) {
                    for (let k = 0; k < arrDocumentosBeneficiciarios.length; k++) {
                        const documento = arrDocumentosBeneficiciarios[k];
                        if (k == (arrDocumentosBeneficiciarios.length - 1)) {
                            documentosBeneficiciario = documentosBeneficiciario + documento;
                        } else { documentosBeneficiciario = documentosBeneficiciario + documento + " | "; }
                    };
                } else if (arrDocumentosBeneficiciariosCPFs.length != 0) {
                    for (let k = 0; k < arrDocumentosBeneficiciariosCPFs.length; k++) {
                        const documento = arrDocumentosBeneficiciariosCPFs[k];
                        if (k == (arrDocumentosBeneficiciariosCPFs.length - 1)) {
                            documentosBeneficiciario = documentosBeneficiciario + documento;
                        } else { documentosBeneficiciario = documentosBeneficiciario + documento + " | "; }
                    };
                } else {
                    documentosBeneficiciario = '';
                };
                // CODIGO OFICIAL DO IMPOSTO/RECEITA DO TRIBUTO - OK
                let codOficialImpostoReceitaTributo = '';
                let listaImpostoDAE2 = regexImpostoDAE2.exec(textoGuia);
                if (listaImpostoDAE2 != null) {
                    let codImposto = /\d{2}\/\d{2}\/\d{4}/.exec(listaImpostoDAE2[0]);
                    codOficialImpostoReceitaTributo = codImposto[0].replace(/\//g, '');
                };
                let listaImpostoGRUSIMPLES = regexImpostoGRUSIMPLES.exec(textoGuia);
                if (listaImpostoGRUSIMPLES != null) {
                    codOficialImpostoReceitaTributo = listaImpostoGRUSIMPLES[0].replace(/Código do */, '');
                };
                let listaImpostoFEDJ = regexImpostoFEDJ.exec(textoGuia);
                if (listaImpostoFEDJ != null) {
                    let codImposto = /\d{3}\-\d{1}/.exec(listaImpostoFEDJ[0]);
                    codOficialImpostoReceitaTributo = codImposto[0].replace(/\-/g, '');
                };
                let listaImpostoCONTAFEPJA = regexImpostoCONTAFEPJA.exec(textoGuia);
                if (listaImpostoCONTAFEPJA != null) {
                    codOficialImpostoReceitaTributo = listaImpostoCONTAFEPJA[0].replace(/\//g, '').replace(/\-/g, '').replace(/\./g, '');
                };
                // TIPO DE GUIA - OK
                let tipoGuia = '';
                let listaTipoGuiaDAE = regexTipoGuiaDAE.exec(textoGuia);
                if (listaTipoGuiaDAE != null) { tipoGuia = 'DAE'; };
                let listaTipoGuiaGRU = regexTipoGuiaGRU.exec(textoGuia);
                if (listaTipoGuiaGRU != null) { tipoGuia = 'GRU'; };
                let listaTipoGuiaFEDTJ = regexTipoGuiaFEDTJ.exec(textoGuia);
                if (listaTipoGuiaFEDTJ != null) { tipoGuia = 'FEDTJ'; };
                let listaTipoGuiaGRCT = regexTipoGuiaGRCT.exec(textoGuia);
                if (listaTipoGuiaGRCT != null) { tipoGuia = 'GRCT'; };
                // TIPO DE IDENTIFICACAO DO CONTRIBUINTE - OK
                let tipoIdentificacaoContribuinte = "CNPJ";
                if (listaCPFs.length != 0) {
                    tipoIdentificacaoContribuinte = "CPF";
                };
                // INSCRICAO ESTADUAL/CODIGO MUNICIPIO/NUMERODECLARACAO - OK
                let inscricaoEstadualCodMunicipioNumDeclaracao = '';
                // CNJ - OK
                let cnjEncontrado = '';
                let listaCNJs = [];
                let listaCNJMASK = textoGuia.match(regexCNJMASK);
                if (listaCNJMASK != null) listaCNJMASK.forEach(element => { listaCNJs.push(element.replace(/\./g, '').replace(/\-/g, '')); });
                let listaCNJLP1 = textoGuia.match(regexCNJLP1);
                if (listaCNJLP1 != null) listaCNJLP1.forEach(element => { listaCNJs.push(element.replace(/Instância: /, '00')); });
                let arrCNJsEncontrados = listaCNJs.filter(function(elem, i, array) { return array.indexOf(elem) === i; });
                if (arrCNJsEncontrados.length != 0) {
                    cnjEncontrado = arrCNJsEncontrados[0];
                } else {
                    cnjEncontrado = '';
                };
                // SAIDAS - 
                let numeroProcessoRecebido = response.NumeroProcesso.replace(/\./g, '').replace(/\-/g, '');
                if (cnjEncontrado != '') { if (numeroProcessoRecebido != cnjEncontrado) { response.CNJDiferente = 'S'; } };
                response.flag = true;
                response.Tipo = 'GUIA';
                response.NumeroCodigoBarras = codicoBarras.replace(/ /g, '');
                response.NomeBancoInstituicao = nomeBancoInstit.trim();
                response.DataVencimento = dataVencimento;
                response.ValorTotal = valorBoleto;
                response.IDGuia = idGuia;
                response.DocumentoBeneficiciario = documentosBeneficiciario;
                response.NomeBeneficiario = nomeBeneficiario.trim();
                response.CodOficialImposto = codOficialImpostoReceitaTributo;
                response.TipoGuia = tipoGuia;
                response.IdentificacaoContribuinte = tipoIdentificacaoContribuinte;
                response.InscricaoEstadual = inscricaoEstadualCodMunicipioNumDeclaracao
                return response;
            }
        } catch (error) {
            logger.error('CBGRCT.js - processing ', error);
            return error;
        }
    };

    return {
        processing: processing
    };
};

module.exports = CBGRCT