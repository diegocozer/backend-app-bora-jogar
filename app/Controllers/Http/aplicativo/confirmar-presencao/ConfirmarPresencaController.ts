import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';
import Jogador from 'App/Models/aplicativo/Cadastros/Jogador';
import TimeJogador from 'App/Models/aplicativo/Cadastros/TimeJogador';
import ConfirmarPresenca from 'App/Models/aplicativo/confirma-presenca/ConfirmarPresenca';
import Equipe from 'App/Models/aplicativo/Equipe/Equipe';
import Jogo from 'App/Models/aplicativo/jogo/Jogo';
import Posicao from 'App/Models/aplicativo/Posicao/Posicao';
import JogadoresSorteio from 'App/Models/aplicativo/Sorteio/JogadoresSorteio';
import TokenUserNotification from 'App/Models/aplicativo/TokenUser';
import Pessoa from 'App/Models/Pessoa';

export default class ConfirmarPresencaController {
    public async atualizarConfirmados({ request, response }: HttpContextContract) {
        try {
            const body = request.body()
            const confirmarPresenca = await ConfirmarPresenca.query()
                .where('codigo_jogador_confirmacao', body?.codigo_jogador_confirmacao)
                .andWhere('codigo_jogo_confirmacao', body?.codigo_jogo_confirmacao).first()
                if(confirmarPresenca !== null){
                    confirmarPresenca?.merge(body)
                    confirmarPresenca?.save()
                    return response.status(201).json({ msg: 'Presença atualizada com sucesso!' })
                }
                return response.status(400).json({ msg: 'Jogo não encontrado!' })
        } catch (error) {
            return response.status(500).json({ msg: 'Erro ao processar', error: error.message })
        }
    }
    public async getInformacoesTimeConfirmado ({ params }: HttpContextContract){
        try {
            
        const infotime = await Database.from('confirmacoes_presenca').select()
        .leftJoin(Jogador.table, 'codigo_jogador', 'codigo_jogador_confirmacao')
        .leftJoin(Pessoa.table, 'codigo_pessoa_jogador', 'codigo_pes')
        .leftJoin(TimeJogador.table, 'codigo_tim', 'codigo_time_jogador')
        .leftJoin(TokenUserNotification.table, 'codigo_pes', 'codigo_pessoa_token')
        .leftJoin(JogadoresSorteio.table, 'jogadores_sorteio.codigo_jogador', 'jogador.codigo_jogador')
        .leftJoin(Equipe.table, 'jogadores_sorteio.codigo_equipe', 'equipes.codigo_equipe')
        .leftJoin(Posicao.table, 'codigo_posicao_jogador', 'codigo_posi')
        .leftJoin(Jogo.table, 'codigo_jogo_confirmacao', 'codigo_jogo')
        .andWhere('codigo_time_jogador', params.codigoTime).andWhere('presenca_confirmacao', 0).andWhereNull('data_confirmacao')
        return infotime
    } catch (error) {
            
    }
    }
    public async getConfirmado ({params}: HttpContextContract){
        const {codigoJogador, codigoJogo} = params;
        const confirmados = await ConfirmarPresenca.query().select().where('codigo_jogador_confirmacao', codigoJogador ).andWhere('codigo_jogo_confirmacao', codigoJogo)
        return confirmados
    }
}
