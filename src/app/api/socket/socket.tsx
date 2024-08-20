import { Server } from 'socket.io'
import { NextApiRequest, NextApiResponse } from 'next'
import { Socket } from 'socket.io'

interface CustomServer extends Server {
  io?: Server
}

interface CustomResponse extends NextApiResponse {
    socket: NextApiResponse['socket'] & {
    server: CustomServer
  }
}

const SocketHandler = (req: NextApiRequest, res: CustomResponse): void => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server as any)
    res.socket.server.io = io

    io.on('connection', (socket: Socket) => {
      socket.on('input-change', (msg: string) => {
        socket.broadcast.emit('update-input', msg)
      })
    })
  }
  res.end()
}

export default SocketHandler