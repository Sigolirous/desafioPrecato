# Desafio Precato

### Desenvolvido Por - Augusto Sigolo

Olá, avaliadar, este é o repositória da minha resolução para o desafio proposto [aqui](https://github.com/precato/desafio-dev-back-end/).

#### Documentação

##### Objetos

Credores:

```json
 {
	"id_credor": integer,
    "nome_credor": string,
    "cpf_credor": string,
    "status_credor": boolean,
    "created_at": timestamp,
    "updated_at": timestamp
 }
```

Entidades Devedoras:

```json
{
	"id_devedor": integer,
    "nome_ente_devedor": string,
    "cnpj_ente_devedor": string,
    "created_at": timestamp,
    "updated_at": timestamp
}
```

Pagamentos:

```json
{
	"id_remessa": integer,
    "id_credor": integer,
    "id_devedor": integer,
    "valor_inicial": float,
    "valor_final": float,
    "data": timestamp,
    "status_remessa": boolean,
    "motivo": string
}
```

**Por mais que, nos objetos, os nomes estejam escritos com snake_case, os modelos foram transcritos para camelCase

##### Rotas e requisições

###### Credores:

| Criar           | Mudar Nome              | Aprovar                     | Visualizar        | Deletar              |
| --------------- | ----------------------- | --------------------------- | ----------------- | -------------------- |
| /credores/criar | /credores/mudarNome/:id | /credores/aprovar/:idCredor | /credores/get/:id | /credores/delete/:id |

Criar credor:

```json
/* Body da requisição */
{
	"nomeCredor": "Augusto Sigolo",
	"cpfCredor": "08835998050"
}

/* Responsa esperada */
{
  "status": "Sucesso",
  "mensagem": "Credor criado com sucesso"
}
```

Mudar Nome:

```json
/* Body da requisição */
{
	"novoNome": "John Doe"
}

/* Resposta esperada */
{
  "mensagem": "Nome do usuário mudado com sucesso"
}
```

Aprovar:

```json
/* Para aprovar um credor não é necessário body */

/* Resposta esperada */
{
  "mensagem": "Credor aprovado com sucesso"
}
```

Visualizar:

```json
/* Para visualisar todos os credores id = "*" */
/* Para visualizar um credor específica id = idCredor */

/* Resposta esperada */
{
  "mensagem": "Sucesso na obtenção dos credores",
  "credores": []
}
```

Deletar:

```json
/* Para deletar um credor específica id = idCredor */

/* Resposta esperada */
{
  "mensagem": "Credor: ${idCredor} deletado com sucesso"
}
```

###### Entidades Devedoras

| Criar                     | Mudar Nome                  | Visualizar                     | Delete                            |
| ------------------------- | --------------------------- | ------------------------------ | --------------------------------- |
| /entidadesDevedoras/criar | /entidadesDevedoras/get/:id | /entidadesDevedoras/delete/:id | /entidadesDevedoras/mudarNome/:id |

Criar

```json
/* Body da requisição */
{
	"nomeEntidadeDevedora": "Precato",
	"cnpjEntidadeDevedora": "35852921000167"
}

/* Resposta esperada */
{
  "status": "Sucesso",
  "mensagem": "Entidade devedora criado com sucesso"
}
```

Mudar Nome

```json
/* Body da requisição */
/* id = idEntidade */
{
	"novoNome": "Precato Ltda."
}

/* Resposta esperada */
{
  "mensagem": "Entidade devedora: ${idEntidade} alterada com sucesso"
}
```

Visualizar

```json
/* Para visualisar todas as entidades devedoras id = "*" */
/* Para visualizar uma entidade devedora específica id = idEntidade */

/* Resposta esperada */
{
  "mensagem": "Sucesso na obtenção dos Entidades Devedoras",
  "entidadesDevedoras": []
}
```

Deletar

```json
/* Para deletar uma entidade devedora específica id = idEntidade */

/* Resposta esperada */
{
    "mensagem": "Entidade devedora: ${params.id} deletada com sucesso"
}
```

###### Solicitações de Pagamento

| Criar             | Mudar               | Visualizar                   | Deletar                |
| ----------------- | ------------------- | ---------------------------- | ---------------------- |
| /pagamentos/criar | /pagamentos/get/:id | /pagamentos/mudar/:id/:field | /pagamentos/delete/:id |

Criar

```json
/* Body da requisição */
{
	"idCredor": 1,
	"idEnteDevedor": 1,
	"valorInicial": 3000,
	"valorFinal": 100
}

/* Resposta esperada */
{
  "mensagem": "Solicitação de pagamento salva com sucesso"
}
```

Mudar

```json
/* id: idPagamento */
/* field: valorFinal || valorInicial */
/* Body da requisição */
{
	"novoValor": 1000
}
```

Visualizar

```json
/* Para ver todas as solicitações de pagamento id = "*" */
/* Para ver uma solicitação específica id = idPagamento

/* Resposta Esperada */
{
  "mensagem": "Retornando solicitação de pagamento de id: 1",
  "solicitacao": []
}
```

Deletar

```json
/* Para deletar uma solicitação específica id = idPagamento */

/* Resposta Esperada */
{
  "mensagem": "Solicitação de pagamento: 1 deletada com sucesso"
}
```

------

## Nota do desenvolvedor

Foi um prazer desenvolver essa aplicação, que, mesmo simples, serviu pra por meus conhecimentos à prova.

Ass. Augusto dos Anjos Sigolo