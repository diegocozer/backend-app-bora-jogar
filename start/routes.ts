import Route from '@ioc:Adonis/Core/Route';



Route.post('/loginApp', 'aplicativo/usuario/UsuarioAppController.loginApp')
Route.post('/cadastrar-usuario', 'aplicativo/usuario/UsuarioAppController.createUsuarioApp')


Route.post('login', 'UsuariosController.login')
Route.get('events', 'EventController.stream');
Route.get('teste', async ({ response }) => {
  return response.json({ message: 'Rota de teste funcionando!' })
})


Route.group(() => {
  Route.post('/save-pushtoken', 'aplicativo/NotificationController.saveToken')

  Route.get('/:token', 'aplicativo/NotificationController.verificaExisteTokenNotification')
  Route.post('/enviar-notificacao', 'aplicativo/NotificationController.sendPushNotification')
  Route.post('/cadastrar-time', 'aplicativo/time/TimeController.insertOrUpdate')
  Route.post('/cadastrar-jogador', 'aplicativo/time/JogadorController.insertOrUpdate')
  Route.post('/cadastrar-usuario', 'aplicativo/usuario/UsuarioAppController.createUsuarioApp')
  Route.get('/getTime/:codigoJog', 'aplicativo/time/TimeController.getTime')
  Route.get('/getTimePresidente/:pres_tim', 'aplicativo/time/TimeController.getTimePresi')
  
  Route.get('/getJogadores/:codtim_jog', 'aplicativo/time/JogadorController.getJogadores')
  Route.get('/todos-jogadores/:codigo', 'aplicativo/time/JogadorController.jogadores')
  Route.post('/salvar-foto-perfil', 'aplicativo/time/JogadorController.insertOrUpdateFotoPerfilJogador')

  Route.get('/convites/:codigoPessoa', 'aplicativo/time/JogadorController.getConvites')
  Route.post('/atualizar-convite', 'aplicativo/time/JogadorController.updateConvite')
  Route.post('/convidar-jogadores', 'aplicativo/time/JogadorController.convidarJogadores')
  
  Route.get('/notificacoes/:codigo_pessoa', 'aplicativo/notificacao/NotificacaoController.getNotificacao')
  Route.post('/limpar-notificacao', 'aplicativo/notificacao/NotificacaoController.limparNotificacao')


  
  Route.post('/logoutApp', 'aplicativo/usuario/UsuarioAppController.logoutApp')
  Route.post('/sorteio-time', 'aplicativo/sorteio/SorteioController.insertOrUpdate')
  Route.get('/getSorteioJogadores/:codigoTime', 'aplicativo/sorteio/SorteioController.getJogadoresSorteio')
  Route.get('/equipe/:codigoTime', 'aplicativo/equipe/EquipeController.getEquipe')

  Route.get('/local-jogo/:latitude/:longitude/:type', 'aplicativo/api-maps/ApiMapsController.getLocalJogo')
  Route.get('/procurar-local/:latitude/:longitude/:name', 'aplicativo/api-maps/ApiMapsController.searchLocal')
 
  Route.get('/confirmados/:codigoJogador/:codigoJogo', 'aplicativo/confirmar-presencao/ConfirmarPresencaController.getConfirmado')
  Route.get('/confirmar-presenca/:codigoTime', 'aplicativo/confirmar-presencao/ConfirmarPresencaController.getInformacoesTimeConfirmado')
  Route.post('/confirmar-presenca', 'aplicativo/confirmar-presencao/ConfirmarPresencaController.atualizarConfirmados')

  Route.post('/salvar-escudo', 'aplicativo/escudo/EscudoController.uploadToGoogleCloud')

  Route.post('/cadastrar-jogo', 'aplicativo/jogo/JogoController.insertOrUpdate')
  Route.get('/getJogo/:codigoPessoa', 'aplicativo/jogo/JogoController.getJogos')
  Route.get('/getJogoTime/:codigoTime', 'aplicativo/jogo/JogoController.getJogosTime')


}).prefix('aplicativo').middleware('auth')

Route.group(() => {
  Route.group(() => {
    Route.post('/cadastrar-pessoa', 'PessoasController.insertOrUpdate')
  }).prefix('pessoa')

  Route.group(() => {
    Route.post('/cadastrar-produto', 'ProdutoController.insertOrUpdate')
    Route.post('/cadastrar-categoriaProd', 'ProdutoController.createCategoriaProd')
    Route.post('/cadatrar-allProdutos', 'ProdutoController.insertAllProdutos')
    Route.get('/getAll', 'ProdutoController.getAllProdutos')
  }).prefix('produto')

  Route.group(() => {
    Route.post('/cadastrar-usuario', 'UsuariosController.create')
    Route.post('/alterar-senha/:codigoUsu', 'UsuariosController.update')
    Route.get('/teste', 'UsuariosController.testeWebSocket')
  }).prefix('usuario')

  Route.group(() => {
    Route.post('/', 'comanda/ComandaController.insertOrUpdate')
    Route.get('/getAll', 'comanda/ComandaController.getAllComandas')
    Route.get('/:numeroComanda', 'comanda/ComandaController.getComandaId')
  }).prefix('comanda')

}).middleware('auth')
Route.any('*', async ({ response }) => {
  response.status(404).json({ error: 'Rota não encontrada' })
})



