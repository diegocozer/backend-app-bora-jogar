// app/Controllers/Http/EventController.ts

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class EventController {
  public async stream({ response }: HttpContextContract) {
    // Configura cabeçalhos SSE
    response.type('text/event-stream');
    response.header('Cache-Control', 'no-cache');
    response.header('Connection', 'keep-alive');

    // Enviar evento inicial para abrir a conexão SSE
    response.response.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      "access-control-allow-origin": '*'
    });
    response.response.write(':ok\n\n');

    // Função para enviar eventos SSE
    const sendEvent = (data: any) => {
      response.response.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    // Exemplo: enviar um evento a cada 5 segundos
    const intervalId = setInterval(() => {
      sendEvent({ message: 'Hello World', timestamp: new Date().toISOString() });
    }, 5000);

    // Lembre-se de fechar a conexão se necessário
    // Você pode ajustar isso conforme a lógica da sua aplicação
    response.request.connection.on('close', () => {
      clearInterval(intervalId); // Limpar o intervalo ao fechar a conexão
      response.response.end();
    });
  }
}
