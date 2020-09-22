var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';
const CNPJParaRemover = ['00.497.373/0001-10', '00497373/0001-10', '00497373000110', '72.820.822/0001-20', '72820822/0001-20', '72820822000120', '72.820.822/0027-69', '72820822/0027-69', '72820822002769'];
const dataInicialFebraban = new Date(1997, 10 - 1, 7);
const BanksMAP = require('../../helper/BanksMAP');
// REGEX CODIGO DE BARRAS 
const regexCodigoPrincipal = /\d{5}.\d{5} \d{5}.\d{6} \d{5}.\d{6} \d \d{14}/;
const regexCodigoPrincipal2 = /BANPARÁ\s037-1\s*\d{47}/;
// REGEX CNPJ 
const regexCNPJ1 = /\d{2}.\d{3}.\d{3}\/\d{4}-\d{2}/g;
const regexCNPJ2 = /\d{8}\/\d{4}\-\d{2}/g;
const regexCNPJ3 = /CNPJ: \d{14}/g;
const regexCNPJ4 = /     \d{14}     /g;
// REGEX CPF 
const regexCPF = /\d{3}\.\d{3}\.\d{3}\-\d{2}/g;
// REGEX ID GUIA 
const regexBBL1P1 = /ID \d{18}/;
const regexBBL2P1 = /\d{3}\.\d{1}\.\d{1}\.\d{4}/;
const regexBBL3P1 = / \d{9} /;
const regexBBL6P1 = /Nº Único da Guia: \d{5}.\d{3}.\d{2}.\d{4}-\d{1}/;
const regexBBL7P1 = / \d{7}\/\d{4} /;
const regexBANPARAL1P1 = /  \d{13}\n/;
const regexBANPARAL2P1 = / \d{2}.\d{3}.\d{4}-\d{1} /;
const regexBANESEL1P1 = /   \d{8}  /;
const regexBANESEL2P1 = /ID....................: \d{6}/;
const regexBRADESCOL1P2 = /Guia: \d{3}.\d{7}-\d{2}/;
const regexHSBC = /  \d{13}  /;
const regexCEF1 = /                \d{18}/;
const regexCEF2 = /Número do Documento: \d{17}-\d{1}/;
const regexCEF3 = /Identificador do Depósito: \d{18}/;
const regexCEF4 = /  \d{7} /;
const regexCEF5 = /  \d{11}  /;
const regexTJDFT = /     \d{17}     /;
// REGEX NOME BENEFICIARIO 
const regexBBL2P1NomeBen = /Agência\/Cod\. Benef\.\n.*\d{4}-\d{1}/;
const regexBBL1P1FUNAJURIS = /Agência \/ Código Cedente\n  +.*CNPJ/;
const regexBBL1P1GRJ = /Data de Vencimento\n *.*CNPJ/;
const regexBBL1P1TJDFT = /Agência\/Código do cendente\n +.*\d{4}\//;
const regexBANPARA1L2P1 = /CÓDIGO CEDENTE\n\n.*\d{6}-\d{1}/;
const regexBANPARA5L1P1 = /Convênio\n\n.*\d{14}/;
const regexBANESECONDENACAOACORDOL2P1 = /CEDENTE: +.*\n\n/;
const regexBANESEL1P2 = /Beneficiário.*Agência \/ Cod\./;
const regexCEFL1P1 = /Código do Cedente\n\n.*\d{2}\.\d{3}\.\d{3}\//;
const regexCEFL1P3 = /Agência\/Código Cedente\n.*\d{2}\.\d{3}\.\d{3}\//;
const regexCEFL1P4 = /Agência \/ Código do Cedente\n.*\d{2}\.\d{3}\.\d{3}\//;
const regexCEFL2P1 = /Agência \/ Código Beneficiário\n.*\d{2}\.\d{3}\.\d{3}\//;
const regexHSBCDAM = /Número do documento *.*\d{4}\//;
// REGEX CNJ 
const regexCNJMASK = /\d{7}-\d{2}\.\d{4}\.\d{1}\.\d{2}\.\d{4}/;
const regexCNJLP1 = /Processo\: +\d{20}/;
const regexCNJLP2 = /PROCESSO\: +\d{20}/;
// REGEX AGENCIA/CONTA 
const regexAC1 = /\d{4} \/ \d{8}\-\w{1}/;
const regexAC2 = /\d{4}\-\d{1}\/\d{3}\.\d{3}\-\w{1}/;
const regexAC3 = /\d{4}\-\d{1} \/ \d{4}\-\d{1}/;
const regexAC4 = /\d{4}\-\d{1} *\/ *\d{5}\-\d{1}/;
const regexAC5 = /\d{4}\/\d{6}/;
const regexAC6 = /\d{4}\/\d{6}\/\d{5}/;
const regexAC7 = /\d{3,4} *\/ *\d{9,16}/;
const regexAC8 = /\d{4} *\/ *\d{7}\n/;
const regexAC9 = /\d{4} *\/ *\d{6}\n/;
const regexAC10 = /\d{4} *\/ *\d{6}\-\d{1}\n/;
const regexAC11 = /\d{2}\-\d{1}\/\d{6}\-\d{1}/;
const regexA12 = /Agência \d{3}/;
const regexC12 = /CEDENTE\n\n.*\d{6}\-\d{1}/;

const CBPADRAO = () => {

    processing = async function(textoGuia, response) {
        try {
            let test = regexCodigoPrincipal.test(textoGuia);
            let test2 = regexCodigoPrincipal2.test(textoGuia);
            let exec = [];
            if (test) {
                exec = regexCodigoPrincipal.exec(textoGuia);
            }

            if (test2) {
                exec[0] = regexCodigoPrincipal2.exec(textoGuia)[0].slice(-47);
                var comMascara = `${exec[0].slice(0, 5)}.${exec[0].slice(5, 10)} ${exec[0].slice(10, 15)}.${exec[0].slice(15, 21)} ${exec[0].slice(21, 26)}.${exec[0].slice(26, 32)} ${exec[0].slice(32, 33)} ${exec[0].slice(33)}`;
                exec[0] = comMascara; // XXXXX.XXXXX XXXXX.XXXXXX XXXXX.XXXXXX X XXXXXXXXXXXXXX
            }

            if (!test && !test2) {
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
                response.PessoaFisica = '';
                response.ChaveBanco = '';
                response.Conta = '';
                response.DigitoConta = '';
                response.Agencia = '';
                response.DigitoAgencia = '';
                return response;
            } else {
                // CODIGO BARRAS - OK 
                let codicoBarras = exec[0];
                // NOME BANCO/INSTATUICAO - OK 
                let nomeBancoInstit = BanksMAP.get(codicoBarras.substr(0, 3));
                // DATA VENCIMENTO - OK 
                let fatorVencimento = parseInt(codicoBarras.substr(40, 4));
                let dataVencimento = dataInicialFebraban.adicionarDias(fatorVencimento);
                // VALOR BOLETO - OK 
                let valorBoleto = parseInt(codicoBarras.substr(44, 10));
                valorBoleto = valorBoleto.toString();
                let reais = valorBoleto.substr(0, valorBoleto.length - 2);
                let centavos = valorBoleto.substr(valorBoleto.length - 2, valorBoleto.length);
                valorBoleto = reais + '.' + centavos;
                valorBoleto = parseFloat(valorBoleto);
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
                // ID GUIA - OK 
                let idGuia = '';
                let listaIdGuias = [];
                let listaBBL1P1 = regexBBL1P1.exec(textoGuia);
                if (listaBBL1P1 != null) listaIdGuias.push(listaBBL1P1[0].replace(/ID /, ''));
                let listaBBL2P1 = regexBBL2P1.exec(textoGuia);
                if (listaBBL2P1 != null) listaIdGuias.push(listaBBL2P1[0]);
                let listaBBL3P1 = regexBBL3P1.exec(textoGuia);
                if (listaBBL3P1 != null) listaIdGuias.push(listaBBL3P1[0].replace(/ /, '').replace(/ /, ''));
                let listaBBL6P1 = regexBBL6P1.exec(textoGuia);
                if (listaBBL6P1 != null) listaIdGuias.push(listaBBL6P1[0].replace('Nº Único da Guia: ', ''));
                let listaBBL7P1 = regexBBL7P1.exec(textoGuia);
                if (listaBBL7P1 != null) listaIdGuias.push(listaBBL7P1[0].replace(/ /, '').replace(/ /, '').replace('/', ''));
                let listaBANPARAL1P1 = regexBANPARAL1P1.exec(textoGuia);
                if (listaBANPARAL1P1 != null) listaIdGuias.push(listaBANPARAL1P1[0].replace(/ /, '').replace(/ /, '').replace(/\n/, ''));
                let listaBANPARAL2P1 = regexBANPARAL2P1.exec(textoGuia);
                if (listaBANPARAL2P1 != null) listaIdGuias.push(listaBANPARAL2P1[0].replace(/ /, '').replace(/ /, ''));
                let listaBANESEL1P1 = regexBANESEL1P1.exec(textoGuia);
                if (listaBANESEL1P1 != null) listaIdGuias.push(listaBANESEL1P1[0].replace(/ /, '').replace(/ /, '').replace(/ /, ''));
                let listaBANESEL2P1 = regexBANESEL2P1.exec(textoGuia);
                if (listaBANESEL2P1 != null) listaIdGuias.push(listaBANESEL2P1[0].replace('ID....................: ', ''));
                let listaBRADESCOL1P2 = regexBRADESCOL1P2.exec(textoGuia);
                if (listaBRADESCOL1P2 != null) listaIdGuias.push(listaBRADESCOL1P2[0].replace('Guia: ', ''));
                let listaHSBC = regexHSBC.exec(textoGuia);
                if (listaHSBC != null) listaIdGuias.push(listaHSBC[0].replace(/ /, '').replace(/ /, '').replace(/ /, '').replace(/ /, ''));
                let listaCEF1 = regexCEF1.exec(textoGuia);
                if (listaCEF1 != null) listaIdGuias.push(listaCEF1[0].replace(/                /, ''));
                let listaCEF2 = regexCEF2.exec(textoGuia);
                if (listaCEF2 != null) listaIdGuias.push(listaCEF2[0].replace(/Número do Documento:/, ''));
                let listaCEF3 = regexCEF3.exec(textoGuia);
                if (listaCEF3 != null) listaIdGuias.push(listaCEF3[0].replace(/Identificador do Depósito: /, ''));
                let listaCEF4 = regexCEF4.exec(textoGuia);
                if (listaCEF4 != null) listaIdGuias.push(listaCEF4[0].replace(/  /, '').replace(/ /, ''));
                let listaCEF5 = regexCEF5.exec(textoGuia);
                if (listaCEF5 != null) listaIdGuias.push(listaCEF5[0].replace(/ /, '').replace(/ /, ''));
                let listaTJDFT = regexTJDFT.exec(textoGuia);
                if (listaTJDFT != null) listaIdGuias.push(listaTJDFT[0].replace(/     /, '').replace(/     /, ''));
                let arrIdsGuias = listaIdGuias.filter(function(elem, i, array) { return array.indexOf(elem) === i; });
                if (arrIdsGuias.length != 0) {
                    idGuia = arrIdsGuias[0];
                } else {
                    idGuia = '';
                };
                // NOME BENEFICIARIO - OK 
                let nomeBeneficiario = '';
                if (documentosBeneficiciario == '') {
                    nomeBeneficiario = nomeBancoInstit;
                } else {
                    let listaNomeBeneficiario = [];
                    let listaBBL2P1 = regexBBL2P1NomeBen.exec(textoGuia);
                    if (listaBBL2P1 != null) listaNomeBeneficiario.push(listaBBL2P1[0].replace(/Agência\/Cod\. Benef\.\n/, '').replace(/\d{4}-\d{1}/, '').replace(/\n/, '').replace(/ \-/g, '').trim());
                    let listaBBL1P1FUNAJURIS = regexBBL1P1FUNAJURIS.exec(textoGuia);
                    if (listaBBL1P1FUNAJURIS != null) listaNomeBeneficiario.push(listaBBL1P1FUNAJURIS[0].replace(/Agência \/ Código Cedente\n  +/, '').replace(/CNPJ/, '').replace(/ \-/g, '').trim());
                    let listaBBL1P1GRJ = regexBBL1P1GRJ.exec(textoGuia);
                    if (listaBBL1P1GRJ != null) listaNomeBeneficiario.push(listaBBL1P1GRJ[0].replace(/Data de Vencimento\n */, '').replace(/CNPJ/, '').replace(/ \-/g, '').trim());
                    let listaBBL1P1TJDFT = regexBBL1P1TJDFT.exec(textoGuia);
                    if (listaBBL1P1TJDFT != null) listaNomeBeneficiario.push(listaBBL1P1TJDFT[0].replace(/Agência\/Código do cendente\n +/, '').replace(/\d{4}\//, '').replace(/ \-/g, '').trim());
                    let listaBANPARA1L2P1 = regexBANPARA1L2P1.exec(textoGuia);
                    if (listaBANPARA1L2P1 != null) listaNomeBeneficiario.push(listaBANPARA1L2P1[0].replace(/CÓDIGO CEDENTE\n\n/, '').replace(/\d{6}-\d{1}/, '').replace(/ \-/g, '').trim());
                    let listaBANPARA5L1P1 = regexBANPARA5L1P1.exec(textoGuia);
                    if (listaBANPARA5L1P1 != null) listaNomeBeneficiario.push(listaBANPARA5L1P1[0].replace(/Convênio\n\n/, '').replace(/\d{14}/, '').trim());
                    let listaBANESECONDENACAOACORDOL2P1 = regexBANESECONDENACAOACORDOL2P1.exec(textoGuia);
                    if (listaBANESECONDENACAOACORDOL2P1 != null) listaNomeBeneficiario.push(listaBANESECONDENACAOACORDOL2P1[0].replace(/CEDENTE: +/, '').replace(/\n\n/, '').replace(/ \-/g, '').trim());
                    let listaBANESEL1P2 = regexBANESEL1P2.exec(textoGuia);
                    if (listaBANESEL1P2 != null) listaNomeBeneficiario.push(listaBANESEL1P2[0].replace(/Beneficiário/, '').replace(/Agência \/ Cod\./, '').replace(/ \-/g, '').trim());
                    let listaCEFL1P1 = regexCEFL1P1.exec(textoGuia);
                    if (listaCEFL1P1 != null) listaNomeBeneficiario.push(listaCEFL1P1[0].replace(/Código do Cedente\n\n/, '').replace(/\d{2}\.\d{3}\.\d{3}\//, '').replace(/ \-/g, '').trim());
                    let listaCEFL1P3 = regexCEFL1P3.exec(textoGuia);
                    if (listaCEFL1P3 != null) listaNomeBeneficiario.push(listaCEFL1P3[0].replace(/Agência\/Código Cedente\n/, '').replace(/\d{2}\.\d{3}\.\d{3}\//, '').replace(/ \-/g, '').trim());
                    let listaCEFL1P4 = regexCEFL1P4.exec(textoGuia);
                    if (listaCEFL1P4 != null) listaNomeBeneficiario.push(listaCEFL1P4[0].replace(/Agência \/ Código do Cedente\n/, '').replace(/\d{2}\.\d{3}\.\d{3}\//, '').replace(/ \-/g, '').trim());
                    let listaCEFL2P1 = regexCEFL2P1.exec(textoGuia);
                    if (listaCEFL2P1 != null) listaNomeBeneficiario.push(listaCEFL2P1[0].replace(/Agência \/ Código Beneficiário\n/, '').replace(/\d{2}\.\d{3}\.\d{3}\//, '').replace(/ \-/g, '').trim());
                    let listaHSBCDAM = regexHSBCDAM.exec(textoGuia);
                    if (listaHSBCDAM != null) listaNomeBeneficiario.push(listaHSBCDAM[0].replace(/Número do documento */, '').replace(/\d{4}\//, '').replace(/ \-/g, '').trim());
                    let arrNomeBeneficiario = listaNomeBeneficiario.filter(function(elem, i, array) { return array.indexOf(elem) === i; });
                    if (arrNomeBeneficiario.length != 0) {
                        nomeBeneficiario = arrNomeBeneficiario[0];
                    } else {
                        nomeBeneficiario = '';
                    };
                };
                // PESSOA FISICA - OK 
                let pessoaFisica = "N";
                if (listaCPFs.length != 0) {
                    pessoaFisica = "S";
                };
                // CHAVE BANCO - OK 
                let chaveBanco = codicoBarras.substr(0, 3);
                // AGENCIA/CONTA - OK 
                let agencia = '';
                let digitoAgencia = '';
                let conta = '';
                let digitoConta = '';
                let listaAC1 = regexAC1.exec(textoGuia);
                if (listaAC1 != null) {
                    listaAC1[0] = listaAC1[0].replace(/ /g, '');
                    agencia = listaAC1[0].substr(0, 4);
                    digitoAgencia = '';
                    conta = listaAC1[0].substr(5, 8);
                    digitoConta = listaAC1[0].substr(14, 1);
                };
                let listaAC2 = regexAC2.exec(textoGuia);
                if (listaAC2 != null) {
                    listaAC2[0] = listaAC2[0].replace(/./g, '');
                    agencia = listaAC2[0].substr(0, 4);
                    digitoAgencia = listaAC2[0].substr(5, 1);
                    conta = listaAC2[0].substr(7, 6);
                    digitoConta = listaAC2[0].substr(14, 1);
                };
                let listaAC3 = regexAC3.exec(textoGuia);
                if (listaAC3 != null) {
                    listaAC3[0] = listaAC3[0].replace(/ /g, '');
                    agencia = listaAC3[0].substr(0, 4);
                    digitoAgencia = listaAC3[0].substr(5, 1);
                    conta = listaAC3[0].substr(7, 4);
                    digitoConta = listaAC3[0].substr(12, 1);
                };
                let listaAC4 = regexAC4.exec(textoGuia);
                if (listaAC4 != null) {
                    listaAC4[0] = listaAC4[0].replace(/ /g, '');
                    agencia = listaAC4[0].substr(0, 4);
                    digitoAgencia = listaAC4[0].substr(5, 1);
                    conta = listaAC4[0].substr(7, 5);
                    digitoConta = listaAC4[0].substr(13, 1);
                };
                let listaAC5 = regexAC5.exec(textoGuia);
                if (listaAC5 != null) {
                    agencia = listaAC5[0].substr(0, 4);
                    digitoAgencia = '';
                    conta = listaAC5[0].substr(5, 6);
                    digitoConta = '';
                };
                let listaAC6 = regexAC6.exec(textoGuia);
                if (listaAC6 != null) {
                    agencia = listaAC6[0].substr(0, 4);
                    digitoAgencia = '';
                    conta = listaAC6[0].substr(5, 6);
                    digitoConta = '';
                };
                let listaAC7 = regexAC7.exec(textoGuia);
                if (listaAC7 != null) {
                    listaAC7[0] = listaAC7[0].replace(/ /g, '');
                    if (listaAC7[0].length == 21) {
                        agencia = listaAC7[0].substr(0, 4);
                        digitoAgencia = '';
                        conta = listaAC7[0].substr(5, 16);
                        digitoConta = '';
                    } else {
                        agencia = listaAC7[0].substr(0, 3);
                        digitoAgencia = '';
                        conta = listaAC7[0].substr(4, 9);
                        digitoConta = '';
                    }
                };
                let listaAC8 = regexAC8.exec(textoGuia);
                if (listaAC8 != null) {
                    listaAC8[0] = listaAC8[0].replace(/ /g, '').replace(/\n/, '');
                    agencia = listaAC8[0].substr(0, 4);
                    digitoAgencia = '';
                    conta = listaAC8[0].substr(5, 7);
                    digitoConta = '';
                };
                let listaAC9 = regexAC9.exec(textoGuia);
                if (listaAC9 != null) {
                    listaAC9[0] = listaAC9[0].replace(/ /g, '').replace(/\n/, '');
                    agencia = listaAC9[0].substr(0, 4);
                    digitoAgencia = '';
                    conta = listaAC9[0].substr(5, 6);
                    digitoConta = '';
                };
                let listaAC10 = regexAC10.exec(textoGuia);
                if (listaAC10 != null) {
                    listaAC10[0] = listaAC10[0].replace(/ /g, '').replace(/\n/, '');
                    agencia = listaAC10[0].substr(0, 4);
                    digitoAgencia = '';
                    conta = listaAC10[0].substr(5, 6);
                    digitoConta = listaAC10[0].substr(12, 1);
                };
                let listaAC11 = regexAC11.exec(textoGuia);
                if (listaAC11 != null) {
                    agencia = listaAC11[0].substr(0, 2);
                    digitoAgencia = listaAC11[0].substr(3, 1);
                    conta = listaAC11[0].substr(5, 6);
                    digitoConta = listaAC11[0].substr(12, 1);
                };
                let listaA12 = regexA12.exec(textoGuia);
                let listaC12 = regexC12.exec(textoGuia);
                if (listaA12 != null && listaC12 != null) {
                    listaA12[0] = listaA12[0].replace(/Agência /, '');
                    agencia = listaA12[0];
                    digitoAgencia = '';
                    listaC12[0] = listaC12[0].replace(/CEDENTE\n\n/, '');
                    let listaC12T = /\d{6}\-\d{1}/.exec(textoGuia);
                    conta = listaC12T[0].substr(0, 6);
                    digitoConta = listaC12T[0].substr(7, 1);
                };
                // CNJ - OK 
                let cnjEncontrado = '';
                let listaCNJs = [];
                let listaCNJMASK = textoGuia.match(regexCNJMASK);
                if (listaCNJMASK != null) listaCNJMASK.forEach(element => { listaCNJs.push(element.replace(/\./g, '').replace(/\-/g, '')); });
                let listaCNJLP1 = textoGuia.match(regexCNJLP1);
                if (listaCNJLP1 != null) listaCNJLP1.forEach(element => { listaCNJs.push(element.replace(/Processo\: +/, '')); });
                let listaCNJLP2 = textoGuia.match(regexCNJLP2);
                if (listaCNJLP2 != null) listaCNJLP2.forEach(element => { listaCNJs.push(element.replace(/PROCESSO\: +/, '')); });
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
                response.Tipo = 'CBPADRAO';
                response.NumeroCodigoBarras = codicoBarras.replace(/\./g, '').replace(/ /g, '').replace(/\-/g, '');
                response.NomeBancoInstituicao = nomeBancoInstit;
                response.DataVencimento = dataVencimento;
                response.ValorTotal = valorBoleto;
                response.IDGuia = idGuia.replace(/\./g, '').replace(/ /g, '').replace(/\-/g, '');
                response.DocumentoBeneficiciario = documentosBeneficiciario.replace(/\./g, '').replace(/ /g, '').replace(/\-/g, '').replace(/\//g, '');
                response.NomeBeneficiario = nomeBeneficiario;
                response.PessoaFisica = pessoaFisica;
                response.ChaveBanco = chaveBanco;
                response.Conta = conta;
                response.DigitoConta = digitoConta;
                response.Agencia = agencia;
                response.DigitoAgencia = digitoAgencia;
                return response;
            }
        } catch (error) {
            logger.error('CBPADRAO.js - processing ', error);
            return error;
        }
    };

    Date.prototype.adicionarDias = function(dias) {
        var data = new Date(this.valueOf());
        data.setDate(data.getDate() + dias);
        let dia = data.getDate();
        let mes = data.getMonth() + 1;
        let ano = data.getFullYear();
        return dia + '/' + mes + '/' + ano;
    };

    return {
        processing: processing
    };
};

module.exports = CBPADRAO