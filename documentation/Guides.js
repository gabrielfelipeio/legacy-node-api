/**
*
* @api {post} https://pj002.elaw.com.br/Guides/request Envio da guia judicial para extrair informações
* @apiName Envio da guia judicial para extrair informações
* @apiDescription Através do documento a aplicação retorna todas as possíveis informações contidas na guia
* @apiGroup Extracao de informacoes da Guia
* @apiVersion  1.0.0
*
*
* @apiHeader (Cabeçalho da requisição) {String} Authorization Valor da autorização (Fornecida para cada usuário)
* @apiHeader (Cabeçalho da requisição) {String} Content-Type Use multipart/form-data
*
*
* @apiParam  (Requisição) {String} parametros Um objeto JSON contento todas as informações necessárias em formato de String
* @apiParam  (Requisição) {File} guia Documento para extrair as informações. Tipos aceitavéis (PDF eletrônico)
*
*
* @apiParamExample {multipart/form-data} Exemplo da String parametros:
* {
*    "organizationid" : "Identificação do cliente",
*    "numeroprocesso" : "Número do processo",
*    "processoid" : "Identificação externa do id do processo",
* }
*
*
* @apiSuccessExample {json} Extração de informações realizadas com sucesso: 200
*   {
*       "Tipo" : "Tipo de documento",
*       "CNJDiferente" : "Informa se o CNJ da guia é diferente do enviado na requisição (S ou N)",
*       "OrganizationId" : "Identificação do cliente",
*       "NumeroProcesso" : "Número do processo",
*       "ProcessoId" : "Identificador externo do processo",
*       "NumeroCodigoBarras" : "Número do codigo de barras (Texto)",
*       "NomeBancoInstituicao" : "Nome do banco instituição",
*       "DataVencimento" : "Data de vencimento da guia (Texto)",
*       "ValorTotal" : "Valor total da guia (Real)",
*       "IDGuia" : "Identificador da guia",
*       "DocumentoBeneficiciario" : "Documento do beneficiário",
*       "NomeBeneficiario" : "Nome do beneficiário",
*       "PessoaFisica" : "Informa se a guia é de pessoa física (S ou N)",
*       "ChaveBanco" : "Identificação do banco gerador da guia",
*       "Conta" : "Número da conta",
*       "DigitoConta" : "Número do dígito da conta",
*       "Agencia" : "Agência da conta",
*       "DigitoAgencia" : "Dígito da agência da conta",
*       "CodOficialImposto" : "Código oficial do imposto",
*       "TipoGuia" : "Tipo de guia",
*       "IdentificacaoContribuinte" : "Identificação do contribuinte",
*       "InscricaoEstadual" : "Número da inscrição estadual",
*       "NomeRazaoSocial" : "Nome razão social",
*       "NomeContribuinte" : "Nome do contribuinte",
*       "CodigoPagamento" : "Código de pagamento da guia",
*       "Competencia" : "Identificação da competência",
*       "Identificador" : "Número de identificação da guia (Texto)",
*       "ValorINSS" : "Valor do INSS (Real)"
*   }
*
*
* @apiSuccessExample {json} Erro ao não enviar documento: 400
*   "arquivo obrigatorio"
*
*
* @apiSuccessExample {json} Erro ao enviar documento que não seja PDF eletrônico: 400
*   "favor enviar PDF eletronico"
*
*
*@apiSuccessExample {json} Erro ao não enviar paramêtros obrigatórios: 400
*   "parameters obrigatorios"
*
*
* @apiSuccessExample {json} Cliente não autorizado: 401
*   "cliente nao autorizado"
*
*
* @apiErrorExample {json} Erro interno ao extrair texto do documento: 500
* {
*     "code" : 500,
*     "codeMessage" : "Mensagem com mais informações sobre o erro"
* }
*
*/