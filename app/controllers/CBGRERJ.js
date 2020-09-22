var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';
// REGEX CODIGO DE BARRAS 
const regexCodigoPrincipal = /\d{11} \d{1} +\d{11} \d{1} +\d{11} \d{1} +\d{11} \d{1}/;
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
const regexDARM = /INSCRIÇÃO .*\d{5}/;
const regexDAR = /Nº \d{8}/;
const regexDARJ = /[A-z]{1} \d{10}/;
const regexDARJ1 = /\d{2}\-\d{6}\-\d{1}\-\d{3}/;
const regexDARJ2 = /DATA DE VENCIMENTO\n.*\d{6}/;
const regexDUA5 = / \d{9} /;
const regexGRERJ = / \d{11}\-\d{2}/;
// REGEX NOME BENEFICIARIO 
const regexDARMnb = /.* INSCRIÇÃO/;
const regexDARCBnb = /.* DAR \/ CB/;
const regexDARJnb = /.* \d{2} - CÓD.UNID.CARTORÁRIA/;
const regexDARJ1nb = /.* DARJ\n/;
const regexDARJ2nb = /.*CARTORÁRIA\n.*\n.* CREDENCIADOS/;
const regexDUA5nb = /.*\n.*\n.* JUIZO\n/;
const regexGRERJnb = /.*\n.* GUIA DE RECOLHIMENTO DE RECEITA JUDICIÁRIA-GRERJ/;
// REGEX DATA VENCIMENTO
const regexDataDARM = /DARM/;
const regexDataDARCB = /DAR \/ CB/;
const regexDataDARJ1 = /DOCUMENTO DE ARRECADAÇÃO - DARJ/;
const regexDataDARJ = /JUDICIÁRIAS - DARJ/;
const regexDataDUA5 = /DUA - PODER JUDICIÁRIO/;
const regexDataGRERJ = /GUIA DE RECOLHIMENTO DE RECEITA JUDICIÁRIA-GRERJ/;
const regexDataGRERJ2 = /GUIA DE RECOLHIMENTO DE RECEITA JUDICIÁRIA - GRERJ/;
// REGEX TIPO DE GUIA
const regexTipoGuiaDAR = /Documento de Arrecadação de Receita/;
const regexTipoGuiaDARM = /Documento de Arrecadação de Receitas Municipais/;
const regexTipoGuiaDARJ = /DOCUMENTO DE ARRECADAÇÃO DE RECEITAS JUDICIÁRIAS/;
const regexTipoGuiaDARJRJ = /DOCUMENTO DE ARRECADAÇÃO - DARJ(DOCUMENTO DE ARRECADACAO DO RIO DE JANEIRO)/;
const regexTipoGuiaDUA = /Documento Único de Arrecadação/;
const regexTipoGuiaDUA2 = /DUA - PODER JUDICIÁRIO/;
const regexTipoGuiaGRERJ = /GUIA DE RECOLHIMENTO DE RECEITA JUDICIÁRIA-GRERJ/;
const regexTipoGuiaGRERJ2 = /GUIA DE RECOLHIMENTO DE RECEITA JUDICIÁRIA - GRERJ/;
// REGEX CODIGO OFICIAL DO IMPOSTO/RECEITA DO TRIBUTO
const regexImpostoDARM = /CÓDIGO DA RECEITA *.*\n/;
const regexImpostoDARCB = /\/\d{4}\-\d{2} +\d* +\d{2}\/\d{4}/;
const regexImpostoDARJ = /BANCOS *.*\n/;
// REGEX INSCRICAO ESTADUAL/CODIGO MUNICIPIO/NUMERODECLARACAO
const regexInscriDARM = /INSCRIÇÃO *.*\n/;
const regexInscriDARCB = /\d{2}\/\d{2}\/\d{4} +\d+ +\-.*\,\d{2}/;
const regexInscriDARJ = /BANCOS CREDENCIADOS:.*\n  \\SÓ O NUMERO/;

const CBGRERJ = () => {

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
                let listaDARMnb = regexDARMnb.exec(textoGuia);
                if (listaDARMnb != null) listaNomeBeneficiario.push(listaDARMnb[0].replace(/ INSCRIÇÃO/, ''));
                let listaDARCBnb = regexDARCBnb.exec(textoGuia);
                if (listaDARCBnb != null) listaNomeBeneficiario.push(listaDARCBnb[0].replace(/ DAR \/ CB/, ''));
                let listaDARJnb = regexDARJnb.exec(textoGuia);
                if (listaDARJnb != null) listaNomeBeneficiario.push(listaDARJnb[0].replace(/ \d{2} - CÓD.UNID.CARTORÁRIA/, ''));
                let listaDARJ1nb = regexDARJ1nb.exec(textoGuia);
                if (listaDARJ1nb != null) listaNomeBeneficiario.push(listaDARJ1nb[0].replace(/ DARJ\n/, ''));
                let listaDARJ2nb = regexDARJ2nb.exec(textoGuia);
                if (listaDARJ2nb != null) listaNomeBeneficiario.push(listaDARJ2nb[0].replace(/CARTORÁRIA\n.*\n/, '').replace(/CREDENCIADOS/, '').replace(/  /g, ''));
                let listaDUA5nb = regexDUA5nb.exec(textoGuia);
                if (listaDUA5nb != null) listaNomeBeneficiario.push(listaDUA5nb[0].replace(/ JUIZO\n/, '').replace(/\n/g, ' ').replace(/  /g, ''));
                let listaGRERJnb = regexGRERJnb.exec(textoGuia);
                if (listaGRERJnb != null) listaNomeBeneficiario.push(listaGRERJnb[0].replace(/\n.* GUIA DE RECOLHIMENTO DE RECEITA JUDICIÁRIA-GRERJ/, '').replace(/\n/g, ' '));
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
                let listaDataDARM = regexDataDARM.exec(textoGuia);
                if (listaDataDARM != null) {
                    let dataBruta = codigoLimpo.substr(19, 8);
                    let ano = dataBruta.substr(0, 4);
                    let mes = dataBruta.substr(4, 2);
                    let dia = dataBruta.substr(6, 2);
                    dataVencimento = dia + "/" + mes + "/" + ano;
                };
                let listaDataDARCB = regexDataDARCB.exec(textoGuia);
                if (listaDataDARCB != null) {
                    let dataBruta = codigoLimpo.substr(19, 8);
                    let ano = dataBruta.substr(0, 4);
                    let mes = dataBruta.substr(4, 2);
                    let dia = dataBruta.substr(6, 2);
                    dataVencimento = dia + "/" + mes + "/" + ano;
                };
                let listaDataDARJ1 = regexDataDARJ1.exec(textoGuia);
                if (listaDataDARJ1 != null) {
                    let dataBruta = codigoLimpo.substr(20, 8);
                    let ano = dataBruta.substr(0, 4);
                    let mes = dataBruta.substr(4, 2);
                    let dia = dataBruta.substr(6, 2);
                    dataVencimento = dia + "/" + mes + "/" + ano;
                };
                let listaDataDAR = regexDataDARJ.exec(textoGuia);
                if (listaDataDAR != null) {
                    let dataBruta = codigoLimpo.substr(19, 8);
                    let ano = dataBruta.substr(0, 4);
                    let mes = dataBruta.substr(4, 2);
                    let dia = dataBruta.substr(6, 2);
                    dataVencimento = dia + "/" + mes + "/" + ano;
                };
                let listaDataDUA5 = regexDataDUA5.exec(textoGuia);
                if (listaDataDUA5 != null) {
                    let dataBruta = codigoLimpo.substr(19, 8);
                    let ano = dataBruta.substr(0, 4);
                    let mes = dataBruta.substr(4, 2);
                    let dia = dataBruta.substr(6, 2);
                    dataVencimento = dia + "/" + mes + "/" + ano;
                };
                let listaDataGRERJ = regexDataGRERJ.exec(textoGuia);
                let listaDataGRERJ2 = regexDataGRERJ2.exec(textoGuia);
                if (listaDataGRERJ != null || listaDataGRERJ2 != null) {
                    let dataBruta = codigoLimpo.substr(23, 8);
                    let ano = dataBruta.substr(0, 4);
                    let mes = dataBruta.substr(4, 2);
                    let dia = dataBruta.substr(6, 2);
                    dataVencimento = dia + "/" + mes + "/" + ano;
                };
                // ID GUIA - OK
                let idGuia = '';
                let listaIdGuias = [];
                let listaDARM = regexDARM.exec(textoGuia);
                if (listaDARM != null) listaIdGuias.push(listaDARM[0].replace(/INSCRIÇÃO/, ''));
                let listaDAR = regexDAR.exec(textoGuia);
                if (listaDAR != null) listaIdGuias.push(listaDAR[0].replace(/Nº /, ''));
                let listaDARJ = regexDARJ.exec(textoGuia);
                if (listaDARJ != null) listaIdGuias.push(listaDARJ[0].replace(/[A-z]{1} /, ''));
                let listaDARJ1 = regexDARJ1.exec(textoGuia);
                if (listaDARJ1 != null) listaIdGuias.push(listaDARJ1[0]);
                let listaDARJ2 = regexDARJ2.exec(textoGuia);
                if (listaDARJ2 != null) listaIdGuias.push(listaDARJ2[0].replace(/DATA DE VENCIMENTO/, '').replace("\n", ''));
                let listaDUA5 = regexDUA5.exec(textoGuia);
                if (listaDUA5 != null) listaIdGuias.push(listaDUA5[0].replace(/ /g, ''));
                let listaGRERJ = regexGRERJ.exec(textoGuia);
                if (listaGRERJ != null) listaIdGuias.push(listaGRERJ[0].replace(/ /g, ''));
                let arrIdsGuias = listaIdGuias.filter(function(elem, i, array) { return array.indexOf(elem) === i; });
                idGuia = arrIdsGuias[0].trim();
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
                let listaImpostoDARM = regexImpostoDARM.exec(textoGuia);
                if (listaImpostoDARM != null) {
                    codOficialImpostoReceitaTributo = listaImpostoDARM[0].replace(/CÓDIGO DA RECEITA/, '').replace(/\n/, '').trim();
                };
                let listaImpostoDARCB = regexImpostoDARCB.exec(textoGuia);
                if (listaImpostoDARCB != null) {
                    codOficialImpostoReceitaTributo = listaImpostoDARCB[0].replace(/\/\d{4}\-\d{2}/, '').replace(/\d{2}\/\d{4}/, '').trim();
                };
                let listaImpostoDARJ = regexImpostoDARJ.exec(textoGuia);
                if (listaImpostoDARJ != null) {
                    codOficialImpostoReceitaTributo = listaImpostoDARJ[0].replace(/BANCOS */, '').replace(/\n/, '').trim();
                };
                // TIPO DE GUIA - OK
                let tipoGuia = '';
                let listaTipoGuiaDAR = regexTipoGuiaDAR.exec(textoGuia);
                if (listaTipoGuiaDAR != null) { tipoGuia = 'DAR'; };
                let listaTipoGuiaDARM = regexTipoGuiaDARM.exec(textoGuia);
                if (listaTipoGuiaDARM != null) { tipoGuia = 'DARM'; };
                let listaTipoGuiaDARJ = regexTipoGuiaDARJ.exec(textoGuia);
                if (listaTipoGuiaDARJ != null) { tipoGuia = 'DARJ'; };
                let listaTipoGuiaDARJRJ = regexTipoGuiaDARJRJ.exec(textoGuia);
                if (listaTipoGuiaDARJRJ != null) { tipoGuia = 'DARJ(RJ)'; };
                let listaTipoGuiaDUA = regexTipoGuiaDUA.exec(textoGuia);
                let listaTipoGuiaDUA2 = regexTipoGuiaDUA2.exec(textoGuia);
                if (listaTipoGuiaDUA != null || listaTipoGuiaDUA2 != null) { tipoGuia = 'DUA'; };
                let listaTipoGuiaGRERJ = regexTipoGuiaGRERJ.exec(textoGuia);
                let listaTipoGuiaGRERJ2 = regexTipoGuiaGRERJ2.exec(textoGuia);
                if (listaTipoGuiaGRERJ != null || listaTipoGuiaGRERJ2 != null) { tipoGuia = 'GRERJ'; };
                // TIPO DE IDENTIFICACAO DO CONTRIBUINTE - OK
                let tipoIdentificacaoContribuinte = "CNPJ";
                if (listaCPFs.length != 0) {
                    tipoIdentificacaoContribuinte = "CPF";
                };
                // INSCRICAO ESTADUAL/CODIGO MUNICIPIO/NUMERODECLARACAO - OK
                let inscricaoEstadualCodMunicipioNumDeclaracao = '';
                let listaInscriDARM = regexInscriDARM.exec(textoGuia);
                if (listaInscriDARM != null) {
                    inscricaoEstadualCodMunicipioNumDeclaracao = listaInscriDARM[0].replace(/INSCRIÇÃO */, '').replace(/\n/, '').trim();
                };
                let listaInscriDARCB = regexInscriDARCB.exec(textoGuia);
                if (listaInscriDARCB != null) {
                    inscricaoEstadualCodMunicipioNumDeclaracao = listaInscriDARCB[0].replace(/\d{2}\/\d{2}\/\d{4}/, '').replace(/ +\-.*\,\d{2}/, '').trim();
                };
                let listaInscriDARJ = regexInscriDARJ.exec(textoGuia);
                if (listaInscriDARJ != null) {
                    inscricaoEstadualCodMunicipioNumDeclaracao = listaInscriDARJ[0].replace(/BANCOS CREDENCIADOS:/, '').replace(/\n  \\SÓ O NUMERO/, '').trim();
                };
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
                response.IDGuia = idGuia.replace(/\./g, '').replace(/ /g, '').replace(/\-/g, '');
                response.DocumentoBeneficiciario = documentosBeneficiciario;
                response.NomeBeneficiario = nomeBeneficiario.trim();
                response.CodOficialImposto = codOficialImpostoReceitaTributo;
                response.TipoGuia = tipoGuia;
                response.IdentificacaoContribuinte = tipoIdentificacaoContribuinte;
                response.InscricaoEstadual = inscricaoEstadualCodMunicipioNumDeclaracao
                return response;
            }
        } catch (error) {
            logger.error('CBGRERJ.js - processing ', error);
            return error;
        }
    };

    return {
        processing: processing
    };
};

module.exports = CBGRERJ