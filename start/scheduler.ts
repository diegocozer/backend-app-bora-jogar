import ItemComandaJob from 'App/Jobs/ItemComandaJob'
import cron from 'node-cron'

cron.schedule('*/5 * * * * *', async () => {
  const job = new ItemComandaJob()
  await job.handle()
})
