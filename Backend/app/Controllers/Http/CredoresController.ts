// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'
import Credor from "App/Models/Credor";
export default class CredoresController {
  async criar({ request, response}){
    Logger.info("Requisição para criar credor recebida")
    const body = request.requestBody
    const { nomeCredor, cpfCredor } = body
    /* Checa se o CPF é válido */
    Logger.info("Checando se o cpf é valido")
    async function TestaCPF(strCPF) {
      /* Função de teste de cpf de: https://www.devmedia.com.br/validar-cpf-com-javascript/23916 */
        var Soma;
        var Resto;
        Soma = 0;
      if (strCPF == "00000000000") return false;

        for (let i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
        Resto = (Soma * 10) % 11;

        if ((Resto == 10) || (Resto == 11))  Resto = 0;
        if (Resto != parseInt(strCPF.substring(9, 10)) ) return false;

        Soma = 0;
        for (let i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
        Resto = (Soma * 10) % 11;

        if ((Resto == 10) || (Resto == 11))  Resto = 0;
        if (Resto != parseInt(strCPF.substring(10, 11) ) ) return false;
        /* Função para checar se o cpf é único no sistema. Não é o
        melhor algorítimo para executar a função, mas decidi deixar a
        eficiência, nessa parte, em segundo plano */
        try{
          Logger.info("Checando se o cpf é único")
          const credores = await Credor.all()
          let cpfs: Array<string> = []
          /* Essa função para ver se o cpf é único pega todos os cpfs
          cadastrados no sistema e procura o cpf novo nele. */
          for(let i = 0; i < credores.length; i++){
            cpfs.push(credores[i].cpfCredor)
          }
          if(cpfs.find(cpf => cpf == strCPF) === undefined){
            return true
          }else{
            Logger.error(`CPF: ${strCPF} já existe no sistema`)
          }
        }catch(error){
          Logger.error('Falha na checagem do CPF')
        }
    }
      try {
        if(await TestaCPF(cpfCredor)){
          const credor = new Credor()
          /* Tenta criar o objeto Credor e postar no BD */
          Logger.info("Criando o objeto credor e postando no BD")
          try{
            credor.nomeCredor = nomeCredor
            credor.cpfCredor = cpfCredor
            await credor.save()
            Logger.info(`Credor {nome: ${nomeCredor}, cpf: ${cpfCredor}} criado com sucesso`)
            response.status(201).json({
              status: "Sucesso",
              mensagem: "Credor criado com sucesso"
            })
          }catch(error){
            Logger.error("Erro interno na criação do Credor")
            response.status(500).json({
              status: "Erro interno na criação do Credor",
              mensagem: error
            })
          }
        }else{
          Logger.error("Cpf inválido")
          response.status(400).json({
            status: "Erro de requisição",
            mensagem: "Cpf invalido"
          })
        }
      } catch (error) {
        Logger.error("Erro interno na checagem do CPF")
        response.status(500).json({
          status: "Erro interno na checagem do CPF",
          mensagem: error
        })
      }
  }

  async get({response, params}){
    Logger.info(`Recebida a requisição para obtensão de credores`)
    try {
      if(params.id === "*"){
        Logger.info("Requisitando todos os credores")
        const Credores = await Credor.all()
        Logger.info("Sucesso na obtenção dos credores")
        response.status(200).json({
          mensagem: "Sucesso na obtenção dos credores",
          credores: Credores
        })
      }else{
        Logger.info(`Requisitando credor de id: ${params.id} ao banco de dados`)
        const CredorObj = await Credor.find(params.id)
        Logger.info(`Credor id: ${params.id} não existe`)
        if(CredorObj === null){
          response.status(204)
        }else{
          Logger.info("Sucesso na obtenção do credor")
          response.status(200).json({
            mensagem: "Sucesso na obtenção do credor",
            credor: CredorObj
          })
        }
      }
    } catch (error) {
      Logger.error("Erro na obtenção de credores")
      Logger.error(error)
      response.status(500).json({
        mensagem: "Erro na obtenção de credores",
        error: error
      })
    }
  }

  async patchNome ({request, response, params}){
    Logger.info("Requisição para mudar o nome do credor recebida")
    try {
      const credorParaMudar = await Credor.find(params.id)
      if(credorParaMudar === null){
        Logger.error(`Credor ${params.id} não existe`)
        response.status(400).json({
          mensagem: "O credor não existe, portanto, não pode ter seu nome alterado"
        })
      }else{
        Logger.info(`Alterando o nome do credor ${params.id} para ${request.requestBody.novoNome}`)
        credorParaMudar.nomeCredor = request.requestBody.novoNome
        await credorParaMudar.save()
        Logger.info("Nome alterado com sucesso")
        response.status(201).json({
          mensagem:"Nome do usuário mudado com sucesso"
        })
      }
    } catch (error) {
      Logger.error(`Erro na alteração do nome do Credor. Erro ${error}`)
      response.status(500).json({
        mensagem: "Erro na alteração do nome do Credor",
        error: error
      })
    }
  }

  async aprovar ({response, params}){
    /* Entendo que aqui, seria necessária uma autenticação de usuário
    master utilizando jwt e afins para fazer a aprovação de novos
    credores, contudo, não foi pedido isso no enunciado do desafio e,
    por economia de tempo,preferi fazer essa aprovação apenas por
    requisições HTTP sem cabeçalho de autenticação nem nada */
    Logger.info("Recebida requisição para aprovação de Credor")
    try {
      const credorParaAprovar = await Credor.find(params.idCredor)
      if(credorParaAprovar === null){
        Logger.error(`Credor: ${params.idCredor} não existe`)
        response.status(400).json({
          mensagem: "O credor não existe, portanto, não pode ser aprovado"
        })
      }else{
        credorParaAprovar.statusCredor = true
        await credorParaAprovar?.save()
        Logger.info(`Credor: ${params.id} aprovado`)
        response.status(200).json({
          mensagem: "Credor aprovado com sucesso"
        })
      }
    } catch (error) {
      Logger.error(`Erro na aprovação do credor: ${params.idCredor}. Erro ${error}`)
      response.status(500).json({
        mensagem: "Erro na aprovação do credor",
        error:error
      })
    }
  }

  async delete ({params, response}){
    Logger.info("Recebida requisição para deletar credor")
    try {
      const credorParaDeletar = await Credor.find(params.id)
      if(credorParaDeletar === null){
        Logger.error(`Credor: ${params.id} não existe, portanto, não pode ser deletado`)
        response.status(400).json({
          mensagem: `Credor: ${params.id} não existe, portanto, não pode ser deletado`
        })
      }else{
        await credorParaDeletar.delete()
        Logger.info(`Credor:${params.id} deletado com sucesso`)
        response.status(200).json({
          mensagem: `Credor:${params.id} deletado com sucesso`
        })
      }
    } catch (error) {
      Logger.error(`Erro para deletar o Credor: ${params.id}. Erro ${error}`)
      response.status(500).json({
        mensagem: `Erro para deletar o Credor: ${params.id}. Erro ${error}`,
        error: error
      })
    }

  }
}
