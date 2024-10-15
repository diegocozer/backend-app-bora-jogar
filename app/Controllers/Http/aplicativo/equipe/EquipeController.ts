import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Equipe from 'App/Models/aplicativo/Equipe/Equipe';

export default class EquipeController {
    // public async insertOrUpdate({ request, response }: HttpContextContract) {
    //     try {
    //         const body = request.only(['jogador_equipe_sorteio', 'equipe_sorteio', 'codigo_time_sorteio']);
    //         let sorteio;

    //         const sorteioAtualizar = await JogadoresSorteio.findBy('codigo_time_sorteio', body.codigo_time_sorteio);
    //         if (sorteioAtualizar) {
    //             sorteioAtualizar.merge(body);
    //             await sorteioAtualizar.save();
    //         } else {
    //             sorteio = await JogadoresSorteio.create(body);
    //         }
    //         return response.status(201).json({
    //             data: sorteio,
    //         });
    //     } catch (error) {
    //         return response.status(500).json({
    //             msg: 'Ocorreu um erro ao processar a requisição',
    //             error: error.message,
    //         });
    //     }
    // }
    public async getEquipe({ params }: HttpContextContract) {
        try {
            const equipe = await Equipe.query().where('codigo_time', params.codigoTime)
            return equipe
        } catch (error) {

        }

    }


}
