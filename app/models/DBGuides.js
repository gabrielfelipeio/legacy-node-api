const mongoose = require('mongoose');

const DBGuidesSchema = mongoose.Schema({
    OrganizationId: String,
    NumeroProcesso: String,
    ProcessoId: String,
    TipoCodigo: String,
    CNJDiferente: String,
    NumeroCodigoBarras: String,
    NomeBancoInstituicao: String,
    DataVencimento: String,
    ValorTotal: Number,
    IDGuia: String,
    DocumentoBeneficiciario: String,
    NomeBeneficiario: String,
    PessoaFisica: String,
    ChaveBanco: String,
    Conta: String,
    DigitoConta: String,
    Agencia: String,
    DigitoAgencia: String,
    CodOficialImposto: String,
    TipoGuia: String,
    IdentificacaoContribuinte: String,
    InscricaoEstadual: String,
    NomeRazaoSocial: String,
    NomeContribuinte: String,
    CodigoPagamento: String,
    Competencia: String,
    Identificador: String,
    ValorINSS: Number,
    DataRegistro: Date,
    TextoGuia: String,
    GuiaBase64: String
});

const DBGuidesModel = mongoose.databases.Pj002.model(
    "db_guides",
    DBGuidesSchema
);

module.exports = DBGuidesModel;