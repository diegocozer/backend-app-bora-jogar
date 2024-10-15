import admin from './firebase.js'; // Importando a configuração do Firebase

// Função para enviar notificações
const enviarNotificacao = async (token, titulo, corpo) => {
  const message = {
    notification: {
      title: titulo,
      body: corpo,
    },
    token: token,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Mensagem enviada com sucesso:', response);
  } catch (error) {
    console.log('Erro ao enviar mensagem:', error);
  }
};

export { enviarNotificacao };
