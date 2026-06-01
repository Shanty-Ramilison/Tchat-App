const express=require('express')
const http = require('http')
const {Server}= require('socket.io')
const cors =require('cors')

const app=express()
app.use(cors())

const server= http.createServer(app)
const io=new Server(server, {
    cors:{origin :"*"}
})

app.get('/', (req,res)=>{
    res.send('Serveur en marche !')
})

let connectes=0
io.on('connection', (socket)=>{
    connectes++
    console.log("Un utilisateur connectee :", socket.id)
    io.emit("connectes", connectes)

    socket.on('message', data =>{
        console.log('Message recu : ', data)
        io.emit('message', data)
    })
    socket.on('typing', (pseudo)=>{
        socket.broadcast.emit('typing', pseudo)
    })
    socket.on('stopTyping', (pseudo)=>{
        socket.broadcast.emit('stopTyping')
    })
    
    socket.on('disconnect', ()=>{
        connectes--
        console.log('Utilisateur deconnectee:', socket.id)
        io.emit('connectes', connectes)
    })
})

server.listen(3000, ()=> {
    console.log('Serveur demarre sur http://localhost:3000')
})

