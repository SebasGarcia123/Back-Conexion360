import app from '../app'
import debug from 'debug'
import http from 'http'
import figlet from 'figlet'
import mongoose from 'mongoose'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import dotenv from 'dotenv'

debug('base-api-express-generator:server')

const env_path = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env'
dotenv.config({ path: env_path })

// Get port from environment and store in Express.
const port = process.env.PORT || 4000
app.set('port', port)

// Create HTTP server.
const server = http.createServer(app)

const db_url = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/'
const db_name = process.env.MONGO_DB || 'test'

// MongoDB database initialization
initDatabase()
  .then(() => console.log('Database connection established successfully!'))
  .catch((err) => console.log(err))

async function initDatabase(): Promise<void> {
  await mongoose.connect(db_url + db_name)
}

// Listen on provided port, on all network interfaces.
server.listen(port, () => {
  printTitle()
})
server.on('error', onError)
server.on('listening', onListening)

// Event listener for HTTP server "error" event.
function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

// Event listener for HTTP server "listening" event.
function onListening(): void {
  const addr = server.address()
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port
  debug('Listening on ' + bind)
}

// Prints the app title and more specifications
function printTitle(): void {
  process.stdout.write('\n')
  process.stdout.write(`${figlet.textSync(`Base API`, { font: 'Ogre' })}\n`)
  process.stdout.write('\n')
  process.stdout.write(
    `Version: ${pkg.version}, Environment: ${process.env.NODE_ENV || 'default'}\n`,
  )
  // process.stdout.write(`Version: ${version}, Environment: ${process.env.NODE_ENV || 'default'}\n`)
  if (process.env.NODE_ENV !== 'production') {
    process.stdout.write(`Listening on port ${port}\n`)
  }
}

// Read package.json without experimental import
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const pkg = JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf8'))
