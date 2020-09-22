define({ "api": [
  {
    "type": "post",
    "url": "https://pj002.elaw.com.br/Guides/request",
    "title": "Envio da guia judicial para extrair informações",
    "name": "Envio_da_guia_judicial_para_extrair_informa__es",
    "description": "<p>Através do documento a aplicação retorna todas as possíveis informações contidas na guia</p>",
    "group": "Extracao_de_informacoes_da_Guia",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Cabeçalho da requisição": [
          {
            "group": "Cabeçalho da requisição",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Valor da autorização (Fornecida para cada usuário)</p>"
          },
          {
            "group": "Cabeçalho da requisição",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>Use multipart/form-data</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Requisição": [
          {
            "group": "Requisição",
            "type": "String",
            "optional": false,
            "field": "parametros",
            "description": "<p>Um objeto JSON contento todas as informações necessárias em formato de String</p>"
          },
          {
            "group": "Requisição",
            "type": "File",
            "optional": false,
            "field": "guia",
            "description": "<p>Documento para extrair as informações. Tipos aceitavéis (PDF eletrônico)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Exemplo da String parametros:",
          "content": "{\n   \"organizationid\" : \"Identificação do cliente\",\n   \"numeroprocesso\" : \"Número do processo\",\n   \"processoid\" : \"Identificação externa do id do processo\",\n}",
          "type": "multipart/form-data"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Extração de informações realizadas com sucesso: 200",
          "content": "{\n    \"Tipo\" : \"Tipo de documento\",\n    \"CNJDiferente\" : \"Informa se o CNJ da guia é diferente do enviado na requisição (S ou N)\",\n    \"OrganizationId\" : \"Identificação do cliente\",\n    \"NumeroProcesso\" : \"Número do processo\",\n    \"ProcessoId\" : \"Identificador externo do processo\",\n    \"NumeroCodigoBarras\" : \"Número do codigo de barras (Texto)\",\n    \"NomeBancoInstituicao\" : \"Nome do banco instituição\",\n    \"DataVencimento\" : \"Data de vencimento da guia (Texto)\",\n    \"ValorTotal\" : \"Valor total da guia (Real)\",\n    \"IDGuia\" : \"Identificador da guia\",\n    \"DocumentoBeneficiciario\" : \"Documento do beneficiário\",\n    \"NomeBeneficiario\" : \"Nome do beneficiário\",\n    \"PessoaFisica\" : \"Informa se a guia é de pessoa física (S ou N)\",\n    \"ChaveBanco\" : \"Identificação do banco gerador da guia\",\n    \"Conta\" : \"Número da conta\",\n    \"DigitoConta\" : \"Número do dígito da conta\",\n    \"Agencia\" : \"Agência da conta\",\n    \"DigitoAgencia\" : \"Dígito da agência da conta\",\n    \"CodOficialImposto\" : \"Código oficial do imposto\",\n    \"TipoGuia\" : \"Tipo de guia\",\n    \"IdentificacaoContribuinte\" : \"Identificação do contribuinte\",\n    \"InscricaoEstadual\" : \"Número da inscrição estadual\",\n    \"NomeRazaoSocial\" : \"Nome razão social\",\n    \"NomeContribuinte\" : \"Nome do contribuinte\",\n    \"CodigoPagamento\" : \"Código de pagamento da guia\",\n    \"Competencia\" : \"Identificação da competência\",\n    \"Identificador\" : \"Número de identificação da guia (Texto)\",\n    \"ValorINSS\" : \"Valor do INSS (Real)\"\n}",
          "type": "json"
        },
        {
          "title": "Erro ao não enviar documento: 400",
          "content": "\"arquivo obrigatorio\"",
          "type": "json"
        },
        {
          "title": "Erro ao enviar documento que não seja PDF eletrônico: 400",
          "content": "\"favor enviar PDF eletronico\"",
          "type": "json"
        },
        {
          "title": "Erro ao não enviar paramêtros obrigatórios: 400",
          "content": "\"parameters obrigatorios\"",
          "type": "json"
        },
        {
          "title": "Cliente não autorizado: 401",
          "content": "\"cliente nao autorizado\"",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Erro interno ao extrair texto do documento: 500",
          "content": "{\n    \"code\" : 500,\n    \"codeMessage\" : \"Mensagem com mais informações sobre o erro\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "documentation/Guides.js",
    "groupTitle": "Extracao_de_informacoes_da_Guia"
  }
] });
