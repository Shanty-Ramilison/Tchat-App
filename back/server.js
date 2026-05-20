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

io.on('connection', (socket) =>{
    console.log('Un utilisateur connectee :', socket.id)

    socket.on('message', (data)=>{
        console.log('Message recu :', data)
        io.emit('message', data)
})
    socket.on('disconnect', ()=> {
        console.log('Utilisateur deconnectee :', socket.id)
    })
})
server.listen(3000, ()=> {
    console.log('Serveur demarre sur http://localhost:3000')
})
