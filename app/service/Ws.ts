import AdonisServer from '@ioc:Adonis/Core/Server'
import { Server } from 'socket.io'

class Ws {
  public io: Server
  private booted = false

  public boot() {
    if (this.booted) {
      return
    }

    this.booted = true
    this.io = new Server(AdonisServer.instance!, {
      cors: {
        origin: '*',
      }
    })

    this.io.on('connection', (socket) => {
      console.log('A user connected')

      socket.on('disconnect', () => {
        console.log('User disconnected')
      })

      socket.on('my other event', (data) => {
        console.log(data)
      })
    })
  }
}

export default new Ws()
