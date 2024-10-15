import { Storage } from '@google-cloud/storage'
import Application from '@ioc:Adonis/Core/Application'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import path from 'path'
const storage = new Storage({
  keyFilename: path.join(Application.appRoot, './borajogarapp-7ea50-firebase-adminsdk-b98z2-b69936fc63.json'),
})

const bucketName = 'escudo-time'

export default class EscudoController {
  public async uploadToGoogleCloud({ request, response }: HttpContextContract) {
    const image = request.file('image', {
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg', 'txt'], 
    })
    if (!image) {
      return response.badRequest('Imagem não enviada')
    }

    const uniqueFileName = `${new Date().getTime()}_${image.clientName}`

    const filePath = path.join(Application.tmpPath('uploads'), uniqueFileName)

    await image.move(Application.tmpPath('uploads'), {
      name: uniqueFileName,
    })

    await storage.bucket(bucketName).upload(filePath, {
      destination: uniqueFileName,
      public: true,
    })

    const publicUrl = `https://storage.googleapis.com/${bucketName}/${uniqueFileName}`

    // Retornar a URL da imagem para o frontend
    return response.json({ url: publicUrl })
  }
}
