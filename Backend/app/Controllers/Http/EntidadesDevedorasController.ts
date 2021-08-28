// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'
import EnteDevedor from 'App/Models/EnteDevedor'
export default class EntidadesDevedorasController {
  async criar({ request, response}){
    Logger.info("Requisição para criar entidadeDevedora recebida")
    const body = request.requestBody
    const { nomeEntidadeDevedora, cnpjEntidadeDevedora } = body
    /* Checa se o CNPJ é válido */
    Logger.info("Checando se o CNPJ é valido")
    async function TestaCNPJ(cnpj) {
      /* Script para verificação de CNJP de: https://www.geradorcnpj.com/javascript-validar-cnpj.htm */

      if(cnpj == '') return false;

      if (cnpj.length != 14)
          return false;

      // Elimina CNPJs invalidos conhecidos
      if (cnpj == "00000000000000" ||
          cnpj == "11111111111111" ||
          cnpj == "22222222222222" ||
          cnpj == "33333333333333" ||
          cnpj == "44444444444444" ||
          cnpj == "55555555555555" ||
          cnpj == "66666666666666" ||
          cnpj == "77777777777777" ||
          cnpj == "88888888888888" ||
          cnpj == "99999999999999")
          return false;

      // Valida DVs
      let tamanho = cnpj.length - 2
      let numeros = cnpj.substring(0,tamanho);
      let digitos = cnpj.substring(tamanho);
      let soma = 0;
      let pos = tamanho - 7;
      for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
              pos = 9;
      }
      let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
      if (resultado != digitos.charAt(0))
          return false;

      tamanho = tamanho + 1;
      numeros = cnpj.substring(0,tamanho);
      soma = 0;
      pos = tamanho - 7;
      for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
              pos = 9;
      }
      resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
      if (resultado != digitos.charAt(1))
            return false;
      /* Função para checar se o cnpj é único no sistema. Não é o
      melhor algorítimo para executar a função, mas decidi deixar a
      eficiência, nessa parte, em segundo plano */
      try{
        Logger.info("Checando se o CNPJ é único")
        const entidadesDevedoras = await EnteDevedor.all()
        let cnpjs: Array<string> = []
        /* Essa função para ver se o cnpj é único pega todos os CNPJs
        cadastrados no sistema e procura o CNPJ novo nele. */
        for(let i = 0; i < entidadesDevedoras.length; i++){
          cnpjs.push(entidadesDevedoras[i].cnpjEnteDevedor)
        }
        console.log(cnpjs)
        console.log(cnpj)
        if(cnpjs.find(cnpjx => cnpjx == cnpj) === undefined){
          return true
        }else{
          Logger.error(`CNPJ: ${cnpj} já existe no sistema`)
        }
      }catch(error){
        Logger.error('Falha na checagem do CNPJ')
      }
    }
      try {
        if(await TestaCNPJ(cnpjEntidadeDevedora)){
          const entidadeDevedora = new EnteDevedor()
          /* Tenta criar o objeto entidadeDevedora e postar no BD */
          Logger.info("Criando o objeto entidadeDevedora e postando no BD")
          try{
            entidadeDevedora.nomeEnteDevedor = nomeEntidadeDevedora
            entidadeDevedora.cnpjEnteDevedor = cnpjEntidadeDevedora
            await entidadeDevedora.save()
            Logger.info(`Entidade devedora {nome: ${nomeEntidadeDevedora}, CNPJ: ${cnpjEntidadeDevedora}} criado com sucesso`)
            response.status(201).json({
              status: "Sucesso",
              mensagem: "Entidade devedora criado com sucesso"
            })
          }catch(error){
            Logger.error("Erro interno na criação do Entidade devedora")
            response.status(500).json({
              status: "Erro interno na criação do Entidade devedora",
              mensagem: error
            })
          }
        }else{
          Logger.error("CNPJ inválido")
          response.status(400).json({
            status: "Erro de requisição",
            mensagem: "CNPJ invalido"
          })
        }
      } catch (error) {
        Logger.error("Erro interno na checagem do CNPJ")
        response.status(500).json({
          status: "Erro interno na checagem do CNPJ",
          mensagem: error
        })
      }
  }

  async get({response, params}){
    Logger.info(`Recebida a requisição para obtenção de Entidades Devedoras`)
    try {
      if(params.id === "*"){
        Logger.info("Requisitando todos os Entidades Devedoras")
        const entidadesDevedoras = await EnteDevedor.all()
        Logger.info("Sucesso na obtenção dos Entidades Devedoras")
        response.status(200).json({
          mensagem: "Sucesso na obtenção dos Entidades Devedoras",
          entidadesDevedoras: entidadesDevedoras
        })
      }else{
        Logger.info(`Requisitando Entidades Devedoras de id: ${params.id} ao banco de dados`)
        const EnteDevedorObj = await EnteDevedor.find(params.id)
        Logger.info(`Entidades Devedoras id: ${params.id} não existe`)
        if(EnteDevedorObj === null){
          response.status(204)
        }else{
          Logger.info("Sucesso na obtenção do Entidades Devedoras")
          response.status(200).json({
            mensagem: "Sucesso na obtenção do Entidades Devedoras",
            EnteDevedor: EnteDevedorObj
          })
        }
      }
    } catch (error) {
      Logger.error("Erro na obtenção de Entidades Devedoras")
      Logger.error(error)
      response.status(500).json({
        mensagem: "Erro na obtenção de entidEntidades DevedorasadesDevedoras",
        error: error
      })
    }
  }

  async delete({response, params}){
    try {
      Logger.info("Requisição recebida para deletar uma Entidade Devedora")
      const entidadeParaDeletar = await EnteDevedor.find(params.id)
      if(entidadeParaDeletar === null){
        Logger.error(`Entidade devedora: ${params.id} não existe, portanto, não pode ser deletada`)
        response.status(400).json({
          mensagem: `Entidade devedora: ${params.id} não existe, portanto, não pode ser deletada`
        })
      }else{
        await entidadeParaDeletar.delete()
        Logger.info(`Entidade devedora: ${params.id} deletada com sucesso`)
        response.status(200).json({
          mensagem: `Entidade devedora: ${params.id} deletada com sucesso`
        })
      }
    } catch (error) {
      Logger.error(`Erro na deleção do nome da Entidade Devedora: ${params.id}. Erro ${error}`)
      response.statis(500).json({
        mensagem: `Erro na deleção do nome da Entidade Devedora: ${params.id}.`,
        error: error
      })
    }
  }

  async patchNome({response, params, request}){
    Logger.info("Requisição recebida para mudar o nome de uma Entidade Devedora")
    try {
      const entidadeParaMudar = await EnteDevedor.find(params.id)
      if(entidadeParaMudar === null){
        Logger.error(`Entidade devedora: ${params.id} não existe, portanto, não pode ser alterada`)
        response.status(400).json({
          mensagem: `Entidade devedora: ${params.id} não existe, portanto, não pode ser alterada`
        })
      }else{
        entidadeParaMudar.nomeEnteDevedor = request.requestBody.novoNome
        await entidadeParaMudar.save()
        Logger.info(`Entidade devedora: ${params.id} alterada com sucesso`)
        response.status(200).json({
          mensagem: `Entidade devedora: ${params.id} alterada com sucesso`
        })
      }
    } catch (error) {
      Logger.error(`Erro na modificação do nome da Entidade Devedora: ${params.id}. Erro ${error}`)
      response.status(500).json({
        mensagem: `Erro na modificação do nome da Entidade Devedora: ${params.id}.`,
        error: error
      })
    }

  }
}
