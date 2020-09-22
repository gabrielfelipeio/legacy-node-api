var log4js = require("log4js");
var logger = log4js.getLogger();
logger.level = "debug";
// REGEX GPS
const regexGPSPrincipal = /GUIA DA PREVIDÊNCIA SOCIAL/;
// REGEX CODIGO DE BARRAS
const regexCodigoPrincipal = /\d{11}-\d{1} +\d{11}-\d{1} +\d{11}-\d{1} +\d{11}-\d{1}/;
const regexCodigoPrincipal2 = /\d{11}\s\d{1}\s\d{11}\s\d{1}\s\d{11}\s\d{1}\s\d{11}\s\d{1}/;
// REGEX CNPJ
const CNPJParaRemover = [
    "00.497.373/0001-10",
    "00497373/0001-10",
    "00497373000110",
    "72.820.822/0001-20",
    "72820822/0001-20",
    "72820822000120",
    "72.820.822/0027-69",
    "72820822/0027-69",
    "72820822002769"
];
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
const regexGuia1 = / +\d{8} +\d{2}\//;
const regexGuia2 = /DAM Nº \d{7}\/\d{4}/;
const regexGuia3 = /GUIA DE ARRECADAÇÃO MUNICIPAL - Nº \d{8}/;
const regexGuia4 = /Guia nº +\d{7}\/\d{4}/;
const regexGuia5 = / +\d{9} +\d{2}\/\d{2}\/\d{4}/;
const regexGuia6 = /\d{2}\.\d{2}\.\d{7}\.\d{2}/;
const regexGuia7 = /\d{4}\.\d{2}\.\d{6}\.\d{3}\-\d{1}/;
const regexGuia8 = /\d{4} +\d{2}\-\d{2}\-\d{4}/;
const regexGuia9 = /\d{3}\.\d{3}\.\d{3}\-\d{2}/;
const regexGuia10 = / +\d{15}\n/;
const regexGuia11 = /\d{1} +\d{12} +/;
const regexGuia12 = /\d{3}\/\d{2}\.\d{3}\.\d{3}\-\d{2}/;
const regexGuia13 = /Número: \d{6}\-\d{1}\/\d{2}/;
const regexGuia14 = / +\d{14}\n/;
const regexGuia15 = /\d{20}\n/;
const regexGuia16 = / +Nº \d{13}\n/;
const regexGuia17 = /\d{3}\.\d{2}\/\d{7}/;
const regexGuia18 = /\d{7} +\d{2}\/\d{2}\/\d{4} a \d{2}\/\d{2}\/\d{4}/;

// REGEX NOME BENEFICIARIO
const regexNomeBen1 = /.*\n.*Data do Documento/;
const regexNomeBen2 = /.* Emissão: .*\n.*\n.*Secretaria/;
const regexNomeBen3 = /.* EXECUÇÃO FISCAL CONTRIBUINTE.* GUIA DE ARRECADAÇÃO MUNICIPAL/;
const regexNomeBen4 = /.* Guia nº.*\d{7}\/\d{4}/;
const regexNomeBen5 = /GRTM-Guia Re colhim. Tributos Municipais .*\n/;
const regexNomeBen6 = /.* +CONTRIBUINTE\n +SECRETARIA MUNICIPAL DA FAZENDA/;
const regexNomeBen7 = /.*\n +GUIA DE RECOLHIMENTO DE DÍVIDA ATIVA/;
const regexNomeBen8 = /.*\n +\d{2}.\d{3}.\d{3}\/\d{4}-\d{2}\n.*\n +.*/;
const regexNomeBen9 = /.* +DARE-SP\n +Secretaria/;
const regexNomeBen10 = /.*\n +SECRETARIA DA FAZENDA +DARE/;
const regexNomeBen11 = /.* 02 +PERÍODO DE APURAÇÃO/;
const regexNomeBen12 = /.*\n +proc./;
const regexNomeBen13 = /.* +INICIAL - 1º GRAU/;
const regexNomeBen14 = /.*Guia Nº\n/;
const regexNomeBen15 = /.* +\d{5}-\d{1}\n/;
const regexNomeBen16 = /.* +Guia de Recolhimento do FDJ/;
const regexNomeBen17 = /.* + GUIA DE DEPÓSITO JUDICIAL REMUNERADO\n/;
const regexNomeBen18 = /.*Serviço de Cobrança do Tribunal de Justiça/;
const regexNomeBen19 = /.*\n +SECRETARIA DE FINANÇAS/;
const regexNomeBen20 = /(COMARCA)\sAV.\sNAÇÕES\sUNIDAS\s*SÃO PAULO\s*(SALVADOR)/; //juntar "COMARCA"+"DE"+"SALVADOR"

// REGEX DATA VENCIMENTO
const regexData85GRU1 = /VENCIMENTO\n\n *\d{2}\/\d{2}\/\d{4}/;
const regexData85DUARJ = /Vencimento:\d{2}\/\d{2}\/\d{4}/;
const regexData85GARS = /Documento válido para pagamento até: \d{2}\/\d{2}\/\d{4}/;
const regexData85GRU2 = /Vencimento\n +\d{2}\/\d{2}\/\d{4}/;
const regexData85DARESP = /Data de Vencimento.*\n.*\d{2}\/\d{2}\/\d{4}/;
const regexData85DARF = /DATA DE VENCIMENTO\n.*\d{2}\/\d{2}\/\d{4}/;
const regexData85DARMT = /SÃO PAULO *.*\d{2}\/\d{2}\/\d{4}/;
const regexData86FDJ = /Vencimento\n.*\d{2}\/\d{2}\/\d{4}/;
const regexData89DUAM = /Pagavel até:\n.*\n.*\n.*\d{2}\/\d{2}\/\d{4}/;
const regexDataVenc = /\d{2}\/\d{2}\/\d{4}/;
const regexDataVencimento = /PAGÁVEL ATÉ\n.*(\d{2}\/\d{2}\/\d{4})/;

// REGEX CODIGO OFICIAL DO IMPOSTO/RECEITA DO TRIBUTO
const regexImpostoPREFEITURASERRA = /Vencimento\n\d{3} Auto Infração \(SEDIR\)/;
const regexImpostoGRTM = /\d{1}\.\d{1}\.\d{1}\.\d{1}\.\d{2}\.\d{2}/;
const regexImpostoDAEMS = /SKY BRASIL SERVICOS LTDA +\d{3}\n/;
const regexImpostoDARE1 = /Detalhe +\d{3}\-\d{1}/;
const regexImpostoDAREMT = /Multa\n +\d{3}/;
const regexImpostoDARF = /DARF +\d{4}\n/;
const regexImpostoDARMT = /VALOR\n\n.*\d{4}/;
const regexImpostoGRU5 = /MINISTÉRIO DA FAZENDA +\d{5}\-\d{1}/;
const regexImpostoDUAM = /Nosso Número\n\n \d{2}\/\d{2}\/\d{4} +.*\d{4}\/\d{2}/;

// REGEX TIPO DE GUIA
const regexTipoGuiaDAM = /Auto Infração \(SEDIR\)/;
const regexTipoGuiaDAM2 = /Documento de Arrecadação Municipal /;
const regexTipoGuiaGAM = /GUIA DE ARRECADAÇÃO MUNICIPAL/;
const regexTipoGuiaGAM2 = /GUIA DE RECOLHIMENTO INTERNET/;
const regexTipoGuiaGAM3 = /Guia de Pagamento Consolidada/;
const regexTipoGuiaGAM4 = /GUIA DE RECOLHIMENTO DE DÍVIDA ATIVA/;
const regexTipoGuiaGRA = /GUIA DE ARRECADAÇÃO/;
const regexTipoGuiaGRTM = /GRTM-Guia Re colhim. Tributos Municipais/;
const regexTipoGuiaDAE = /DOCUMENTO DE +\d{3}\.\d{3}\.\d{3}-\d{2}\n +ARRECADAÇÃO ESTADUAL/;
const regexTipoGuiaDARE = /Documento de Arrecadação de Receitas Estaduais/;
const regexTipoGuiaDARF = /Documento de Arrecadação de Receitas Federais/;
const regexTipoGuiaDAR = /DOCUMENTO DE ARRECADAÇÃO - DAR/;
const regexTipoGuiaDUAJ = /DUAJ-Documento Único de Arrecadação/;
const regexTipoGuiaGA = /GUIA DE ARRECADAÇÃO - GA/;
const regexTipoGuiaGRU = /Guia de Recolhimento da União/;
const regexTipoGuiaFDJ = /F.D.J. Fundo de Desenvolvimento da Justiça/;
const regexTipoGuiaGDJR = /GUIA DE DEPÓSITO JUDICIAL REMUNERADO/;
const regexTipoGuiaGUC = /GUIA ÚNICA DE CUSTAS/;
const regexTipoGuiaDUAM = /DOCUMENTO ÚNICO DE\n +ARRECADAÇÃO MUNICIPAL/;
const regexTipoGuiaDAJE = /Documento de Arrecadação Judicial e Extrajudicial/;

// REGEX INSCRICAO ESTADUAL/CODIGO MUNICIPIO/NUMERODECLARACAO
const regexInscrGRA = /\d{20}/;
const regexInscrDAREMT = /Período de Referência\n +\d{2}\.\d{3}\.\d{3}\-\d{1}/;
const regexInscrDARMT = /INSCRIÇÃO ESTADUAL\n\n.*\d{2}\.\d{3}\.\d{3}\-\d{1}/; //(limpar "INSCRIÇÃO ESTADUAL\n\n.*")
const regexInscrDUAM = /INSC\.MUNICIPAL: \d{2}\.\d{3}\.\d{3}\-\d{1}/;
const regexInscrDAJE = /CÓDIGO DESTINO\n\s*SERVIDOR\s*x\sJUDICIAL\s*EXTRAJUDICIAL\s*DELEGATÁRIO\s*SUBSTITUTO\s*(\d{4})/;

const CBGRU = () => {

    processing = async function(textoGuia, response) {
        try {
            let test = regexCodigoPrincipal.test(textoGuia);
            let test2 = regexCodigoPrincipal2.test(textoGuia);
            let exec = regexCodigoPrincipal.exec(textoGuia);
            let exec2 = regexCodigoPrincipal2.exec(textoGuia);
            let execGPS = regexGPSPrincipal.test(textoGuia);

            if (!test && !test2) {
                response.flag = false;
                response.Tipo = "";
                response.CNJDiferente = "N";
                response.NumeroCodigoBarras = "";
                response.NomeBancoInstituicao = "";
                response.DataVencimento = "";
                response.ValorTotal = 0;
                response.IDGuia = "";
                response.DocumentoBeneficiciario = "";
                response.NomeBeneficiario = "";
                response.CodOficialImposto = "";
                response.TipoGuia = "";
                response.IdentificacaoContribuinte = "";
                response.InscricaoEstadual = "";
                return response;
            } else if (execGPS == true) {
                response.flag = false;
                response.Tipo = "";
                response.CNJDiferente = "N";
                response.NumeroCodigoBarras = "";
                response.NomeBancoInstituicao = "";
                response.DataVencimento = "";
                response.ValorTotal = 0;
                response.IDGuia = "";
                response.DocumentoBeneficiciario = "";
                response.NomeBeneficiario = "";
                response.CodOficialImposto = "";
                response.TipoGuia = "";
                response.IdentificacaoContribuinte = "";
                response.InscricaoEstadual = "";
                return response;
            } else {
                // CODIGO BARRAS - OK
                let codigoLimpo = "";
                if (exec) {
                    codigoBarras = exec[0];
                    codigoLimpo = codigoBarras.replace(/ /g, "").replace(/-/g, "");
                } else if (exec2) {
                    codigoBarras = exec2[0];
                    codigoLimpo = codigoBarras.replace(/\s/gm, "");
                }
                let partecodigo1 = codigoLimpo.substr(0, 11);
                let partecodigo2 = codigoLimpo.substr(12, 11);
                let partecodigo3 = codigoLimpo.substr(24, 11);
                let partecodigo4 = codigoLimpo.substr(36, 11);
                codigoLimpo = partecodigo1 + partecodigo2 + partecodigo3 + partecodigo4;

                // VALOR BOLETO - OK
                let valorBoleto = parseInt(codigoLimpo.substr(4, 11));
                valorBoleto = valorBoleto.toString();
                let reais = valorBoleto.substr(0, valorBoleto.length - 2);
                let centavos = valorBoleto.substr(
                    valorBoleto.length - 2,
                    valorBoleto.length
                );
                valorBoleto = reais + "." + centavos;
                valorBoleto = parseFloat(valorBoleto);
                // NOME BENEFICIARIO - OK
                let nomeBeneficiario = "";
                let listaNomeBeneficiario = [];

                let listaNomeBen1 = regexNomeBen1.exec(textoGuia);
                if (listaNomeBen1 != null)
                    listaNomeBeneficiario.push(
                        listaNomeBen1[0].replace(/\n.*Data do Documento/, "").trim()
                    );

                let listaNomeBen2 = regexNomeBen2.exec(textoGuia);
                if (listaNomeBen2 != null)
                    listaNomeBeneficiario.push(
                        listaNomeBen2[0]
                        .replace(/Emissão: .*\n/, "")
                        .replace(/\n.*Secretaria/, "")
                        .trim()
                    );

                let listaNomeBen3 = regexNomeBen3.exec(textoGuia);
                if (listaNomeBen3 != null)
                    listaNomeBeneficiario.push(
                        listaNomeBen3[0]
                        .replace(
                            /EXECUÇÃO FISCAL CONTRIBUINTE.* GUIA DE ARRECADAÇÃO MUNICIPAL/,
                            ""
                        )
                        .trim()
                    );

                let listaNomeBen4 = regexNomeBen4.exec(textoGuia);
                if (listaNomeBen4 != null)
                    listaNomeBeneficiario.push(
                        listaNomeBen4[0].replace(/Guia nº.*\d{7}\/\d{4}/, "").trim()
                    );

                let listaNomeBen5 = regexNomeBen5.exec(textoGuia);
                if (listaNomeBen5 != null)
                    listaNomeBeneficiario.push(
                        listaNomeBen5[0]
                        .replace(/GRTM-Guia Re colhim. Tributos Municipais/, "")
                        .replace(/\n/, "")
                        .trim()
                    );

                let listaNomeBen6 = regexNomeBen6.exec(textoGuia);
                if (listaNomeBen6 != null)
                    listaNomeBeneficiario.push(
                        listaNomeBen6[0]
                        .replace(/ +CONTRIBUINTE\n +SECRETARIA MUNICIPAL DA FAZENDA/, "")
                        .trim()
                    );

                let listaNomeBen7 = regexNomeBen7.exec(textoGuia);
                if (listaNomeBen7 != null)
                    listaNomeBeneficiario.push(
                        listaNomeBen7[0]
                        .replace(/\n +GUIA DE RECOLHIMENTO DE DÍVIDA ATIVA/, "")
                        .trim()
                    );

                let listaNomeBen8 = regexNomeBen8.exec(textoGuia);
                if (listaNomeBen8 != null)
                    listaNomeBeneficiario.push(
                        listaNomeBen8[0]
                        .replace(/ +\d{2}.\d{3}.\d{3}\/\d{4}-\d{2}\n.*\n +/, "")
                        .replace(/\n/, " ")
                        .trim()
                    );

                let listaNomeBen9 = regexNomeBen9.exec(textoGuia);
                if (listaNomeBen9 != null)
                    listaNomeBeneficiario.push(
                        listaNomeBen9[0].replace(/ +DARE-SP\n +Secretaria/, "").trim()
                    );

                let listaNomeBen10 = regexNomeBen10.exec(textoGuia);
                if (listaNomeBen10 != null)
                    listaNomeBeneficiario.push(
                        listaNomeBen10[0]
                        .replace(/\n +SECRETARIA DA FAZENDA +DARE/, "")
                        .trim()
                    );

                let listaNomeBen11 = regexNomeBen11.exec(textoGuia);
                if (listaNomeBen11 != null)
                    listaNomeBeneficiario.push(
                        listaNomeBen11[0].replace(/02 +PERÍODO DE APURAÇÃO/, "").trim()
                    );

                let listaNomeBen12 = regexNomeBen12.exec(textoGuia);
                if (listaNomeBen12 != null)
                    listaNomeBeneficiario.push(
                        listaNomeBen12[0].replace(/\n +proc./, "").trim()
                    );

                let listaNomeBen13 = regexNomeBen13.exec(textoGuia);
                if (listaNomeBen13 != null)
                    listaNomeBeneficiario.push(
                        listaNomeBen13[0].replace(/ +INICIAL - 1º GRAU/, "").trim()
                    );

                let listaNomeBen14 = regexNomeBen14.exec(textoGuia);
                if (listaNomeBen14 != null)
                    listaNomeBeneficiario.push(
                        listaNomeBen14[0].replace(/Guia Nº\n/, "").trim()
                    );

                let listaNomeBen15 = regexNomeBen15.exec(textoGuia);
                if (listaNomeBen15 != null)
                    listaNomeBeneficiario.push(
                        listaNomeBen15[0].replace(/ +\d{5}-\d{1}\n/, "").trim()
                    );

                let listaNomeBen16 = regexNomeBen16.exec(textoGuia);
                if (listaNomeBen16 != null)
                    listaNomeBeneficiario.push(
                        listaNomeBen16[0]
                        .replace(/ +Guia de Recolhimento do FDJ/, "")
                        .trim()
                    );

                let listaNomeBen17 = regexNomeBen17.exec(textoGuia);
                if (listaNomeBen17 != null)
                    listaNomeBeneficiario.push(
                        listaNomeBen17[0]
                        .replace(/ + GUIA DE DEPÓSITO JUDICIAL REMUNERADO\n/, "")
                        .trim()
                    );

                let listaNomeBen18 = regexNomeBen18.exec(textoGuia);
                if (listaNomeBen18 != null)
                    listaNomeBeneficiario.push(
                        listaNomeBen18[0]
                        .replace(/Serviço de Cobrança do Tribunal de Justiça/, "")
                        .trim()
                    );

                let listaNomeBen19 = regexNomeBen19.exec(textoGuia);
                if (listaNomeBen19 != null)
                    listaNomeBeneficiario.push(
                        listaNomeBen19[0].replace(/\n +SECRETARIA DE FINANÇAS/, "").trim()
                    );

                let listaNomeBen20 = regexNomeBen20.exec(textoGuia);
                if (listaNomeBen20 != null)
                    listaNomeBeneficiario.push(
                        listaNomeBen20[1] + " DE " + listaNomeBen20[2]
                    );

                let arrNomeBeneficiario = listaNomeBeneficiario.filter(function(
                    elem,
                    i,
                    array
                ) {
                    return array.indexOf(elem) === i;
                });
                if (arrNomeBeneficiario.length != 0) {
                    nomeBeneficiario = arrNomeBeneficiario[0];
                } else {
                    nomeBeneficiario = "";
                }
                // NOME BANCO/INSTATUICAO - OK
                let nomeBancoInstit = "";
                nomeBancoInstit = nomeBeneficiario;
                // DATA VENCIMENTO - OK
                let dataVencimento = "";
                let codData = codigoLimpo.substr(0, 2);
                if (codData == "81") {
                    let dataBruta = codigoLimpo.substr(17, 8);
                    let ano = dataBruta.substr(0, 4);
                    let mes = dataBruta.substr(4, 2);
                    let dia = dataBruta.substr(6, 2);
                    dataVencimento = dia + "/" + mes + "/" + ano;
                } else {
                    let listaData85GRU1 = regexData85GRU1.exec(textoGuia);
                    if (listaData85GRU1 != null) {
                        dataVencimento = listaData85GRU1[0]
                            .replace(/VENCIMENTO\n\n */, "")
                            .trim();
                    }

                    let listaData85DUARJ = regexData85DUARJ.exec(textoGuia);
                    if (listaData85DUARJ != null) {
                        dataVencimento = listaData85DUARJ[0]
                            .replace(/Vencimento:/, "")
                            .trim();
                    }

                    let listaData85GARS = regexData85GARS.exec(textoGuia);
                    if (listaData85GARS != null) {
                        dataVencimento = listaData85GARS[0]
                            .replace(/Documento válido para pagamento até: /, "")
                            .trim();
                    }

                    let listaData85GRU2 = regexData85GRU2.exec(textoGuia);
                    if (listaData85GRU2 != null) {
                        dataVencimento = listaData85GRU2[0]
                            .replace(/Vencimento\n +/, "")
                            .trim();
                    }

                    let listaData85DARESP = regexData85DARESP.exec(textoGuia);
                    if (listaData85DARESP != null) {
                        let dataVenc = regexDataVenc.exec(listaData85DARESP[0]);
                        dataVencimento = dataVenc[0];
                    }

                    let listaData85DARF = regexData85DARF.exec(textoGuia);
                    if (listaData85DARF != null) {
                        let dataVenc = regexDataVenc.exec(listaData85DARF[0]);
                        dataVencimento = dataVenc[0];
                    }

                    let listaData85DARMT = regexData85DARMT.exec(textoGuia);
                    if (listaData85DARMT != null) {
                        let dataVenc = regexDataVenc.exec(listaData85DARMT[0]);
                        dataVencimento = dataVenc[0];
                    }

                    let listaData86FDJ = regexData86FDJ.exec(textoGuia);
                    if (listaData86FDJ != null) {
                        let dataVenc = regexDataVenc.exec(listaData86FDJ[0]);
                        dataVencimento = dataVenc[0];
                    }

                    let listaData89DUAM = regexData89DUAM.exec(textoGuia);
                    if (listaData89DUAM != null) {
                        let dataVenc = regexDataVenc.exec(listaData89DUAM[0]);
                        dataVencimento = dataVenc[0];
                    }

                    let temDataVencimento = regexDataVencimento.exec(textoGuia);
                    if (temDataVencimento) {
                        let dataVenc = textoGuia.match(regexDataVencimento)[1];
                        dataVencimento = dataVenc;
                    }
                }
                // ID GUIA - OK
                let idGuia = "";
                let listaIdGuias = [];
                let listaGuia1 = regexGuia1.exec(textoGuia);
                if (listaGuia1 != null)
                    listaIdGuias.push(listaGuia1[0].replace(/ +\d{2}\//, "").trim());

                let listaGuia2 = regexGuia2.exec(textoGuia);
                if (listaGuia2 != null)
                    listaIdGuias.push(
                        listaGuia2[0].replace(/DAM Nº /, "").replace(/\//g, "")
                    );

                let listaGuia3 = regexGuia3.exec(textoGuia);
                if (listaGuia3 != null)
                    listaIdGuias.push(
                        listaGuia3[0].replace(/GUIA DE ARRECADAÇÃO MUNICIPAL - Nº /, "")
                    );

                let listaGuia4 = regexGuia4.exec(textoGuia);
                if (listaGuia4 != null)
                    listaIdGuias.push(
                        listaGuia4[0].replace(/Guia nº +/, "").replace(/\//g, "")
                    );

                let listaGuia5 = regexGuia5.exec(textoGuia);
                if (listaGuia5 != null)
                    listaIdGuias.push(
                        listaGuia5[0].replace(/ +\d{2}\/\d{2}\/\d{4}/, "").trim()
                    );

                let listaGuia6 = regexGuia6.exec(textoGuia);
                if (listaGuia6 != null)
                    listaIdGuias.push(listaGuia6[0].replace(/\./g, ""));

                let listaGuia7 = regexGuia7.exec(textoGuia);
                if (listaGuia7 != null)
                    listaIdGuias.push(
                        listaGuia7[0].replace(/\./g, "").replace(/\-/g, "")
                    );

                let listaGuia8 = regexGuia8.exec(textoGuia);
                if (listaGuia8 != null)
                    listaIdGuias.push(listaGuia8[0].replace(/ +\d{2}\-\d{2}\-\d{4}/, ""));

                let listaGuia9 = regexGuia9.exec(textoGuia);
                if (listaGuia9 != null)
                    listaIdGuias.push(
                        listaGuia9[0].replace(/\./g, "").replace(/\-/g, "")
                    );

                let listaGuia10 = regexGuia10.exec(textoGuia);
                if (listaGuia10 != null)
                    listaIdGuias.push(listaGuia10[0].replace(/\n/, "").trim());

                let listaGuia11 = regexGuia11.exec(textoGuia);
                if (listaGuia11 != null)
                    listaIdGuias.push(listaGuia11[0].replace(/\d{1} +/, "").trim());

                let listaGuia12 = regexGuia12.exec(textoGuia);
                if (listaGuia12 != null)
                    listaIdGuias.push(
                        listaGuia12[0]
                        .replace(/\./g, "")
                        .replace(/\-/g, "")
                        .replace(/\//g, "")
                    );

                let listaGuia13 = regexGuia13.exec(textoGuia);
                if (listaGuia13 != null)
                    listaIdGuias.push(
                        listaGuia13[0]
                        .replace(/Número: /, "")
                        .replace(/\-/g, "")
                        .replace(/\//g, "")
                    );

                let listaGuia14 = regexGuia14.exec(textoGuia);
                if (listaGuia14 != null)
                    listaIdGuias.push(listaGuia14[0].replace(/\n/, "").trim());

                let listaGuia15 = regexGuia15.exec(textoGuia);
                if (listaGuia15 != null)
                    listaIdGuias.push(listaGuia15[0].replace(/\n/, ""));

                let listaGuia16 = regexGuia16.exec(textoGuia);
                if (listaGuia16 != null)
                    listaIdGuias.push(
                        listaGuia16[0].replace(/ +Nº /, "").replace(/\n/, "")
                    );

                let listaGuia17 = regexGuia17.exec(textoGuia);
                if (listaGuia17 != null)
                    listaIdGuias.push(
                        listaGuia17[0].replace(/\./g, "").replace(/\//g, "")
                    );

                let listaGuia18 = regexGuia18.exec(textoGuia);
                if (listaGuia18 != null)
                    listaIdGuias.push(
                        listaGuia18[0].replace(
                            / +\d{2}\/\d{2}\/\d{4} a \d{2}\/\d{2}\/\d{4}/,
                            ""
                        )
                    );
                let arrIdsGuias = listaIdGuias.filter(function(elem, i, array) {
                    return array.indexOf(elem) === i;
                });
                if (arrIdsGuias.length != 0) {
                    idGuia = arrIdsGuias[0]
                        .trim()
                        .replace(/\./g, "")
                        .replace(/ /g, "")
                        .replace(/\-/g, "");
                } else {
                    idGuia = arrIdsGuias[0];
                }
                // DOCUMENTO BENEFICIARIO - OK
                let documentosBeneficiciario = "";
                let listaCPFs = [];
                let listaCPF = textoGuia.match(regexCPF);
                if (listaCPF != null)
                    listaCPF.forEach(element => {
                        listaCPFs.push(element);
                    });
                let listaCNPJs = [];
                let listaCNPJ1 = textoGuia.match(regexCNPJ1);
                if (listaCNPJ1 != null)
                    listaCNPJ1.forEach(element => {
                        listaCNPJs.push(element);
                    });
                let listaCNPJ2 = textoGuia.match(regexCNPJ2);
                if (listaCNPJ2 != null)
                    listaCNPJ2.forEach(element => {
                        listaCNPJs.push(element);
                    });
                let listaCNPJ3 = textoGuia.match(regexCNPJ3);
                if (listaCNPJ3 != null)
                    listaCNPJ3.forEach(element => {
                        listaCNPJs.push(element.replace("CNPJ: ", ""));
                    });
                let listaCNPJ4 = textoGuia.match(regexCNPJ4);
                if (listaCNPJ4 != null)
                    listaCNPJ4.forEach(element => {
                        listaCNPJs.push(element.replace(/     /, "").replace(/     /, ""));
                    });
                let arrDocumentosBeneficiciarios = listaCNPJs.filter(function(
                    elem,
                    i,
                    array
                ) {
                    return array.indexOf(elem) === i;
                });
                let arrDocumentosBeneficiciariosCPFs = listaCPFs.filter(function(
                    elem,
                    i,
                    array
                ) {
                    return array.indexOf(elem) === i;
                });
                for (let i = 0; i < CNPJParaRemover.length; i++) {
                    const valueToRemove = CNPJParaRemover[i];
                    arrDocumentosBeneficiciarios = arrDocumentosBeneficiciarios.filter(
                        item => item !== valueToRemove
                    );
                }
                if (arrDocumentosBeneficiciarios.length != 0) {
                    for (let k = 0; k < arrDocumentosBeneficiciarios.length; k++) {
                        const documento = arrDocumentosBeneficiciarios[k];
                        if (k == arrDocumentosBeneficiciarios.length - 1) {
                            documentosBeneficiciario = documentosBeneficiciario + documento;
                        } else {
                            documentosBeneficiciario =
                                documentosBeneficiciario + documento + " | ";
                        }
                    }
                } else if (arrDocumentosBeneficiciariosCPFs.length != 0) {
                    for (let k = 0; k < arrDocumentosBeneficiciariosCPFs.length; k++) {
                        const documento = arrDocumentosBeneficiciariosCPFs[k];
                        if (k == arrDocumentosBeneficiciariosCPFs.length - 1) {
                            documentosBeneficiciario = documentosBeneficiciario + documento;
                        } else {
                            documentosBeneficiciario =
                                documentosBeneficiciario + documento + " | ";
                        }
                    }
                } else {
                    documentosBeneficiciario = "";
                }
                // CODIGO OFICIAL DO IMPOSTO/RECEITA DO TRIBUTO - OK
                let codOficialImpostoReceitaTributo = "";
                let listaImpostoPREFEITURASERRA = regexImpostoPREFEITURASERRA.exec(
                    textoGuia
                );
                if (listaImpostoPREFEITURASERRA != null) {
                    codOficialImpostoReceitaTributo = listaImpostoPREFEITURASERRA[0]
                        .replace(/Vencimento\n/, "")
                        .replace(/ Auto Infração \(SEDIR\)/, "");
                }
                let listaImpostoGRTM = regexImpostoGRTM.exec(textoGuia);
                if (listaImpostoGRTM != null) {
                    codOficialImpostoReceitaTributo = listaImpostoGRTM[0].replace(
                        /\./g,
                        ""
                    );
                }
                let listaImpostoDAEMS = regexImpostoDAEMS.exec(textoGuia);
                if (listaImpostoDAEMS != null) {
                    codOficialImpostoReceitaTributo = listaImpostoDAEMS[0]
                        .replace(/SKY BRASIL SERVICOS LTDA +/, "")
                        .replace(/\n/, "");
                }
                let listaImpostoDARE1 = regexImpostoDARE1.exec(textoGuia);
                if (listaImpostoDARE1 != null) {
                    codOficialImpostoReceitaTributo = listaImpostoDARE1[0].replace(
                        /Detalhe +/,
                        ""
                    );
                }
                let listaImpostoDAREMT = regexImpostoDAREMT.exec(textoGuia);
                if (listaImpostoDAREMT != null) {
                    codOficialImpostoReceitaTributo = listaImpostoDAREMT[0].replace(
                        /Multa\n +/,
                        ""
                    );
                }
                let listaImpostoDARF = regexImpostoDARF.exec(textoGuia);
                if (listaImpostoDARF != null) {
                    codOficialImpostoReceitaTributo = listaImpostoDARF[0]
                        .replace(/DARF +/, "")
                        .replace(/\n/, "");
                }
                let listaImpostoDARMT = regexImpostoDARMT.exec(textoGuia);
                if (listaImpostoDARMT != null) {
                    let impostoReceita = /\d{4}/.exec(listaImpostoDARMT[0]);
                    codOficialImpostoReceitaTributo = impostoReceita[0];
                }
                let listaImpostoGRU5 = regexImpostoGRU5.exec(textoGuia);
                if (listaImpostoGRU5 != null) {
                    codOficialImpostoReceitaTributo = listaImpostoGRU5[0]
                        .replace(/MINISTÉRIO DA FAZENDA +/, "")
                        .replace(/\-/g, "");
                }
                let listaImpostoDUAM = regexImpostoDUAM.exec(textoGuia);
                if (listaImpostoDUAM != null) {
                    codOficialImpostoReceitaTributo = listaImpostoDUAM[0]
                        .replace(/Nosso Número\n\n \d{2}\/\d{2}\/\d{4} +/, "")
                        .replace(/\d{4}\/\d{2}/, "")
                        .trim();
                }
                // TIPO DE GUIA - OK
                let tipoGuia = "";
                let listaTipoGuiaDAM = regexTipoGuiaDAM.exec(textoGuia);
                let listaTipoGuiaDAM2 = regexTipoGuiaDAM2.exec(textoGuia);
                if (listaTipoGuiaDAM != null || listaTipoGuiaDAM2 != null) {
                    tipoGuia = "DAM";
                }
                let listaTipoGuiaGAM = regexTipoGuiaGAM.exec(textoGuia);
                let listaTipoGuiaGAM2 = regexTipoGuiaGAM2.exec(textoGuia);
                let listaTipoGuiaGAM3 = regexTipoGuiaGAM3.exec(textoGuia);
                let listaTipoGuiaGAM4 = regexTipoGuiaGAM4.exec(textoGuia);
                if (
                    listaTipoGuiaGAM != null ||
                    listaTipoGuiaGAM2 != null ||
                    listaTipoGuiaGAM3 != null ||
                    listaTipoGuiaGAM4 != null
                ) {
                    tipoGuia = "GAM";
                }
                let listaTipoGuiaGRA = regexTipoGuiaGRA.exec(textoGuia);
                if (listaTipoGuiaGRA != null) {
                    tipoGuia = "GRA";
                }
                let listaTipoGuiaGRTM = regexTipoGuiaGRTM.exec(textoGuia);
                if (listaTipoGuiaGRTM != null) {
                    tipoGuia = "GRTM";
                }
                let listaTipoGuiaDAE = regexTipoGuiaDAE.exec(textoGuia);
                if (listaTipoGuiaDAE != null) {
                    tipoGuia = "DAE";
                }
                let listaTipoGuiaDARE = regexTipoGuiaDARE.exec(textoGuia);
                if (listaTipoGuiaDARE != null) {
                    tipoGuia = "DARE";
                }
                let listaTipoGuiaDARF = regexTipoGuiaDARF.exec(textoGuia);
                if (listaTipoGuiaDARF != null) {
                    tipoGuia = "DARF";
                }
                let listaTipoGuiaDAR = regexTipoGuiaDAR.exec(textoGuia);
                if (listaTipoGuiaDAR != null) {
                    tipoGuia = "DAR";
                }
                let listaTipoGuiaDUAJ = regexTipoGuiaDUAJ.exec(textoGuia);
                if (listaTipoGuiaDUAJ != null) {
                    tipoGuia = "DUAJ";
                }
                let listaTipoGuiaGA = regexTipoGuiaGA.exec(textoGuia);
                if (listaTipoGuiaGA != null) {
                    tipoGuia = "GA";
                }
                let listaTipoGuiaGRU = regexTipoGuiaGRU.exec(textoGuia);
                if (listaTipoGuiaGRU != null) {
                    tipoGuia = "GRU";
                }
                let listaTipoGuiaFDJ = regexTipoGuiaFDJ.exec(textoGuia);
                if (listaTipoGuiaFDJ != null) {
                    tipoGuia = "FDJ";
                }
                let listaTipoGuiaGDJR = regexTipoGuiaGDJR.exec(textoGuia);
                if (listaTipoGuiaGDJR != null) {
                    tipoGuia = "GDJR";
                }
                let listaTipoGuiaGUC = regexTipoGuiaGUC.exec(textoGuia);
                if (listaTipoGuiaGUC != null) {
                    tipoGuia = "GUC";
                }
                let listaTipoGuiaDUAM = regexTipoGuiaDUAM.exec(textoGuia);
                if (listaTipoGuiaDUAM != null) {
                    tipoGuia = "DUAM";
                }

                let listaTipoGuiaDAJE = regexTipoGuiaDAJE.exec(textoGuia);
                if (listaTipoGuiaDAJE != null) {
                    tipoGuia = "DAJE";
                }

                // TIPO DE IDENTIFICACAO DO CONTRIBUINTE - OK
                let tipoIdentificacaoContribuinte = "CNPJ";
                if (listaCPFs.length != 0) {
                    tipoIdentificacaoContribuinte = "CPF";
                }
                // INSCRICAO ESTADUAL/CODIGO MUNICIPIO/NUMERODECLARACAO - OK
                let inscricaoEstadualCodMunicipioNumDeclaracao = "";
                let listaInscriGRA = regexInscrGRA.exec(textoGuia);
                if (listaInscriGRA != null) {
                    inscricaoEstadualCodMunicipioNumDeclaracao = listaInscriGRA[0];
                }
                let listaInscriDAREMT = regexInscrDAREMT.exec(textoGuia);
                if (listaInscriDAREMT != null) {
                    inscricaoEstadualCodMunicipioNumDeclaracao = listaInscriDAREMT[0]
                        .replace(/Período de Referência\n +/, "")
                        .replace(/\-/g, "")
                        .replace(/\./g, "")
                        .trim();
                }
                let listaInscriDARMT = regexInscrDARMT.exec(textoGuia);
                if (listaInscriDARMT != null) {
                    let inscriEstadual = /\d{2}\.\d{3}\.\d{3}\-\d{1}/.exec(textoGuia);
                    inscricaoEstadualCodMunicipioNumDeclaracao = inscriEstadual[0]
                        .replace(/\-/g, "")
                        .replace(/\./g, "");
                }
                let listaInscriDUAM = regexInscrDUAM.exec(textoGuia);
                if (listaInscriDUAM != null) {
                    inscricaoEstadualCodMunicipioNumDeclaracao = listaInscriDUAM[0]
                        .replace(/INSC\.MUNICIPAL: /, "")
                        .replace(/\-/g, "")
                        .replace(/\./g, "")
                        .trim();
                }

                let listaInscriDAJE = regexInscrDAJE.exec(textoGuia);
                if (listaInscriDAJE != null) {
                    inscricaoEstadualCodMunicipioNumDeclaracao = listaInscriDAJE[1].trim();
                }

                // CNJ - OK
                let cnjEncontrado = "";
                let listaCNJs = [];
                let listaCNJMASK = textoGuia.match(regexCNJMASK);
                if (listaCNJMASK != null)
                    listaCNJMASK.forEach(element => {
                        listaCNJs.push(element.replace(/\./g, "").replace(/\-/g, ""));
                    });
                let listaCNJLP1 = textoGuia.match(regexCNJLP1);
                if (listaCNJLP1 != null)
                    listaCNJLP1.forEach(element => {
                        listaCNJs.push(element.replace(/Instância: /, "00"));
                    });
                let arrCNJsEncontrados = listaCNJs.filter(function(elem, i, array) {
                    return array.indexOf(elem) === i;
                });
                if (arrCNJsEncontrados.length != 0) {
                    cnjEncontrado = arrCNJsEncontrados[0];
                } else {
                    cnjEncontrado = "";
                }
                // SAIDAS -
                let numeroProcessoRecebido = response.NumeroProcesso.replace(
                    /\./g,
                    ""
                ).replace(/\-/g, "");
                if (cnjEncontrado != "") {
                    if (numeroProcessoRecebido != cnjEncontrado) {
                        response.CNJDiferente = "S";
                    }
                }
                response.flag = true;
                response.Tipo = "GUIA";
                response.NumeroCodigoBarras = codigoBarras
                    .replace(/ /g, "")
                    .replace(/-/g, "");
                response.NomeBancoInstituicao = nomeBancoInstit.trim();
                response.DataVencimento = dataVencimento;
                response.ValorTotal = valorBoleto;
                response.IDGuia = idGuia;
                response.DocumentoBeneficiciario = documentosBeneficiciario;
                response.NomeBeneficiario = nomeBeneficiario.trim();
                response.CodOficialImposto = codOficialImpostoReceitaTributo;
                response.TipoGuia = tipoGuia;
                response.IdentificacaoContribuinte = tipoIdentificacaoContribuinte;
                response.InscricaoEstadual = inscricaoEstadualCodMunicipioNumDeclaracao;
                return response;
            }
        } catch (error) {
            logger.error("CBGRU.js - processing ", error);
            return error;
        }
    };

    return {
        processing: processing
    };
};

module.exports = CBGRU;