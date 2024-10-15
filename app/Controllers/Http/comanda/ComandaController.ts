import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Comanda from 'App/Models/comanda/Comanda';
import ItemComanda from 'App/Models/comanda/ItemComanda';
import OrdemComanda from 'App/Models/comanda/OrdemComanda';


export default class ComandaController {
  public async insertOrUpdate({ request, response }: HttpContextContract) {
    try {
      const body = request.only(['numero', 'ordens']);
      const aberta = 1;
      let msg = 'Comanda criada com sucesso!';
      let comanda;
  
      const comandaAtualizar = await Comanda.findBy('numero_com', body.numero);
      if (comandaAtualizar) {
        // Atualizar ordens e itens
        const ordem = await OrdemComanda.findBy('codcom_ocm', comandaAtualizar.codigo_com);
  
        if (ordem) {
          const existingItems = await ItemComanda.query().where('ordem_itc', ordem.codigo_ocm);
          const newProductIds = body.ordens.map(o => o.produto_itc);
  
          // Remover itens que não estão na nova lista
          for (const item of existingItems) {
            if (!newProductIds.includes(item.produto_itc)) {
              await item.delete();
            }
          }
  
          // Atualizar ou adicionar itens
          for (const ordemData of body.ordens) {
            const itemComanda = existingItems.find(item => item.produto_itc === ordemData.produto_itc);
            if (itemComanda) {
              // Atualizar item existente
              itemComanda.merge({
                quantidade_itc: ordemData.quantidade_itc,
                preco_itc: ordemData.preco_itc,
              });
              await itemComanda.save();
            } else {
              // Criar novo item
              await ItemComanda.create({
                ordem_itc: ordem.codigo_ocm,
                produto_itc: ordemData.produto_itc,
                quantidade_itc: ordemData.quantidade_itc,
                preco_itc: ordemData.preco_itc,
              });
            }
          }
  
          msg = 'Comanda atualizada com sucesso!';
          comanda = comandaAtualizar;
        }
      } else {
        // Criar a comanda
        comanda = await Comanda.create({
          numero_com: body.numero,
          codsta_com: aberta,
        });
  
        // Criar a ordem
        const ordem = await OrdemComanda.create({
          codcom_ocm: comanda.codigo_com,
        });
  
        // Criar itens
        for (const ordemData of body.ordens) {
          await ItemComanda.create({
            ordem_itc: ordem.codigo_ocm,
            produto_itc: ordemData.produto_itc,
            quantidade_itc: ordemData.quantidade_itc,
            preco_itc: ordemData.preco_itc,
          });
        }
      }
  
      return response.status(201).json({
        msg: msg,
        data: comanda,
      });
    } catch (error) {
      console.log(error);
      return response.status(500).json({
        msg: 'Ocorreu um erro ao processar a requisição',
        error: error.message,
      });
    }
  }
  

  public async getAllComandas ({ auth}: HttpContextContract) {
    return await Comanda.query().select(). where('codsta_com' , 1)
  }
  public async getComandaId ({request, auth}: HttpContextContract) {
    const {numeroComanda} = request.params()
    try {
      const comanda = await Comanda.query()
      .select()
      .where('codsta_com' , 1)
      .andWhere('numero_com', numeroComanda).firstOrFail()

      const ordemComanda = await OrdemComanda.query().select().where('codcom_ocm', comanda.codigo_com).firstOrFail()

      const itemComanda = await ItemComanda.query().select().preload("produto").where('ordem_itc', ordemComanda.codigo_ocm)

    return {...comanda.$attributes
      , ...ordemComanda.$attributes
      , itemComanda }
    } catch (error) {
      return false
    }
  }
}
