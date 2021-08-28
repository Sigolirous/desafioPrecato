import Logger from "@ioc:Adonis/Core/Logger";
// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Pagamento from "App/Models/Pagamento";
import Credor from "App/Models/Credor";
import EnteDevedor from "App/Models/EnteDevedor";
import { safeStringify } from "@poppinss/utils";
export default class PagamentosController {
  async criar({request, response}){
    Logger.info("Recebida a solicitação para criar uma solicitação de pagamento")
    const body = request.requestBody
    const {idCredor, idEnteDevedor, valorInicial, valorFinal} = body
    try {
      Logger.info("Iniciando os testes das regras")
      /* Teste das regras de negócio */
      async function checaSituacaoCredor(idCredor){
        const credorSolicitante = await Credor.find(idCredor)
        if(credorSolicitante?.statusCredor != null){
          if(credorSolicitante.statusCredor != true){
            return false
          }else{
            return true
          }
        }else{
          return false
        }
      }

      async function checaExistenciaDevedor(idEnteDevedor){
        const devedorASerCobrado = await EnteDevedor.find(idEnteDevedor)
        if(devedorASerCobrado === null){
          return false
        }else{
          return true
        }
      }

      function checaVInicialEVFinal(valorInicial, valorFinal){
        if(valorFinal <= 0 || valorInicial <=0){
          return false
        }else{
          return true
        }
      }

      function checaFinalMenorInicial(valorInicial: number, valorFinal: number){
        if(valorFinal >= valorInicial){
          return false
        }else{
          return true
        }
      }

      if(await checaSituacaoCredor(idCredor) && checaExistenciaDevedor(idEnteDevedor) && checaVInicialEVFinal(valorInicial, valorFinal) && checaFinalMenorInicial(valorInicial, valorFinal)){
        Logger.info("Solicitação de pagamento está idealmente formatada. Iniciando postagem no BD")
        const solPagamento = await new Pagamento()
        solPagamento.idCredor = idCredor
        solPagamento.idDevedor = idEnteDevedor
        solPagamento.valorFinal = valorFinal
        solPagamento.valorInicial = valorInicial
        solPagamento.status_remessa = true
        solPagamento.motivo = "Remessa aprovada"
        await solPagamento.save()
        Logger.info("Solicitação de pagamento salva com sucesso")
        response.status(201).json({
          mensagem: "Solicitação de pagamento salva com sucesso"
        })
      }else{
        Logger.info("Solicitação de pagamento não cumpre as regras de negócio. Iniciando postagem no BD")
        const solPagamento = await new Pagamento()
        const testes = {
          "Credor_Aprovado": await checaSituacaoCredor(idCredor),
          "Entidade_Devedora_Existe_No_Sistema": await checaExistenciaDevedor(idEnteDevedor),
          "Valores_Diferentes_De_Zero": checaVInicialEVFinal(valorInicial, valorFinal),
          "Valor_Final_Menor_Que_Valor_Inicial": checaFinalMenorInicial(valorInicial, valorFinal)
        }
        solPagamento.idCredor = idCredor
        solPagamento.idDevedor = idEnteDevedor
        solPagamento.valorFinal = valorFinal
        solPagamento.valorInicial = valorInicial
        solPagamento.status_remessa = false
        solPagamento.motivo = `True = Seguiu a regra de negócio || False = Não seguiu .::. ${safeStringify(testes)}`
        await solPagamento.save()
        Logger.info("Solicitação de pagamento salva com sucesso")
        response.status(201).json({
          mensagem: "Solicitação de pagamento salva com sucesso"
        })
      }
    }catch (error) {
        Logger.error(`Erro na criação da solicitação de pagamento. Erro: ${error}`)
        response.status(500).json({
          mensagem: `Erro na criação da solicitação de pagamento`,
          error: JSON.stringify(error)
        })
    }

  }

  async get({response, params}){
    try {
      Logger.info("Recebida a requisição para obtenção de Pagamentos")
      if(params.id === '*'){
        Logger.info("Retornando todas as solicitações de pagamento")
        response.status(200).json({
          mensagem: "Retornando todas as solicitações de pagamento",
          pagamentos: await Pagamento.all()
        })
      }else{
        Logger.info(`Requisitando a solicitação de pagamento de id:${params.id}`)
        const pagamento = await Pagamento.find(params.id)
        if(pagamento === null){
          Logger.error(`Solicitação de pagamento de id:${params.id} não existe no sistema`)
          response.status(400).json({
            mensagem: `Solicitação de pagamento de id:${params.id} não existe no sistema`
          })
        }else{
          Logger.info(`Retornando solicitação de pagamento de id: ${params.id}`)
          response.status(200).json({
            mensagem: `Retornando solicitação de pagamento de id: ${params.id}`,
            solicitacao: pagamento
          })
        }
      }
    } catch (error) {
      Logger.error(`Erro na obtenção das solicitações de pagamento. Erro: ${error}`)
      response.status(500).json({
        mensagem: "Erro na obtenção das solicitações de pagamento",
        error: error
      })
    }
  }

  async patch({request, response, params}){
    Logger.info("Recebida requisição para mudança em uma solicitação de pagamento")
    try {
      const pagamento = await Pagamento.find(params.id)
      if(pagamento == null){
        Logger.error(`Solicitação de pagamento de id: ${params.id} não existe no sistema`)
        response.status(400).json({
          mensagem: `Solicitação de pagamento de id: ${params.id} não existe no sistema`
        })
      }else{
        const novoValor = request.requestBody.novoValor
        const field = params.field
        console.log(field)
        switch (field) {
          case 'valorInicial':
            if(novoValor > pagamento.valorFinal && novoValor >= 0 ){
              Logger.info("Requisição para alteração do valor inicial")
              pagamento.valorInicial = novoValor
              await pagamento.save()
              Logger.info("Valor inicial alterado com sucesso")
              response.status(200).json({
                mensagem: "Valor inicial alterado com sucesso"
              })
            }else{
              Logger.error(`O valor ${novoValor} não é um valor válido para o novo valor final pois não respeita as regras de negócio`)
              response.status(400).json({
                mensagem: `O valor ${novoValor} não é um valor válido para o novo valor final pois não respeita as regras de negócio`
              })
            }
            break;
          case 'valorFinal':
            Logger.info("Requisição para alteração do valor final")
            if(novoValor < pagamento.valorInicial && novoValor > 0){
              pagamento.valorFinal = novoValor
              await pagamento.save()
              Logger.info("Valor final alterado com sucesso")
              response.status(200).json({
                mensagem: "Valor final alterado com sucesso"
              })
            }else{
              Logger.error(`O valor ${novoValor} não é um valor válido para o novo valor inicial pois não respeita as regras de negócio`)
              response.status(400).json({
                mensagem: `O valor ${novoValor} não é um valor válido para o novo valor inicial pois não respeita as regras de negócio`
              })
            }
            break;
          default:
            Logger.error(`O campo ${field} não existe ou não pode ser alterado`)
            response.status(400).json({
              mensagem: `O campo ${field} não existe ou não pode ser alterado`
            })
            break;
        }
      }
    } catch (error) {
      Logger.error(`Erro na modificação dos valores da solicitação de pagamento de id: ${params.id}`)
    }
  }

  async delete({params, response}){
    try {
      try {
        Logger.info("Requisição recebida para deletar uma Solicitação de pagamento")
        const solicitacaoParaDeletar = await Pagamento.find(params.id)
        console.log(solicitacaoParaDeletar)
        if(solicitacaoParaDeletar === null){
          Logger.error(`Solicitação de pagamento: ${params.id} não existe, portanto, não pode ser deletada`)
          response.status(400).json({
            mensagem: `Solicitação de pagamento: ${params.id} não existe, portanto, não pode ser deletada`
          })
        }else{
          await solicitacaoParaDeletar.delete()
          Logger.info(`Solicitação de pagamento: ${params.id} deletada com sucesso`)
          response.status(200).json({
            mensagem: `Solicitação de pagamento: ${params.id} deletada com sucesso`
          })
        }
      } catch (error) {
        Logger.error(`Erro na deleção da Solicitação de pagamento: ${params.id}. Erro ${error}`)
        response.statis(500).json({
          mensagem: `Erro na deleção da Solicitação de pagamento: ${params.id}.`,
          error: error
        })
      }
    } catch (error) {

    }
  }
}
