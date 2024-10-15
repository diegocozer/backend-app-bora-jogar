import ItemComanda from "App/Models/comanda/ItemComanda"

class ItemComandaJob {
  async handle() {
    const items = await ItemComanda.query().select()
  }
}

export default ItemComandaJob
