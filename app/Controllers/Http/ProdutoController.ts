import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Categoria from 'App/Models/produto/CategoriaProduto';
import Produto from 'App/Models/produto/Produtos';

export default class ProdutoController {
  async insertOrUpdate({ request, auth }: HttpContextContract) {
    const body = request.body()
    const produto = await Produto.create(body)
    return {
      msg: 'Produto criada com sucesso!',
      data: produto,
    }
  }
  async insertAllProdutos({ request, auth }: HttpContextContract) {
    const body = request.body()
    body.map(async (items) => 
        await Produto.create(items)
    )
    return {
      msg: 'Produto criada com sucesso!',
    }
  }
  async getAllProdutos() {
  const produtos = await Categoria.query().preload('produto')
    return produtos
  }




  async createCategoriaProd({ request, auth}: HttpContextContract) {
    const body = request.body()
    const categoria = await Categoria.create(body)
    return {
      msg: 'Categoria criada com sucesso!',
      data: categoria,
    }
  }
}
