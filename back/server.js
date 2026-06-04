const express=require('express')
const http = require('http')
const {Server}= require('socket.io')
const cors =require('cors')
const mysql=require ('mysql2/promise')
const jwt=require('jsonwebtoken')
const bcrypt =require('bcryptjs')
require('dotenv').config()

const app=express()
app.use(cors({
    origin: 'http://localhost:5173'
}))
app.use(express.json())

app.get('/', (req, res)=>{
    res.json({message: '✅ Serveur Tchat opérationnel !'})
})

const pool=mysql.createPool({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
})
pool.getConnection()
    .then(()=> console.log('✅ MySQL connecté !'))
    .catch(err=> console.log('❌ Erreur MySQL :', err.message))

const server= http.createServer(app)
const io=new Server(server, {
    cors:{origin :"*"}
})

app.post('/api/auth/register', async (req , res)=>{
    try{
        const{username, password}=req.body
        if(!username || !password)
            return res.status(400).json({message: 'Champs obligatoirea.'})

        const [existe]=await pool.execute(
            'SELECT * FROM users WHERE username = ? ', [username]
        )
        if(existe.length>0)
            return res.status(400).json({message: 'Username deja pris.'})

        const hash=await bcrypt.hash(password, 10)

        await pool.execute(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hash]
        )

        res.status(201).json({message: 'Compte cree !'})
    } catch(err){
        res.status(500).json({message: 'Erreur serveur.', error: err.message})
    }
})

app.post('/api/auth/login', async (req,res)=>{
    try{
        const{username, password}=req.body

        if(!username || !password)
            return res.status(400).json({message: 'Champs obligatoires.'})

        const [users]= await pool.execute(
            'SELECT * FROM users WHERE username = ?', [username]
        )

        if(users.length===0)
            return res.status(401).json({message: 'Username ou mot de passe incorrect.'})

        const user= users[0]

        const mdpValide=await bcrypt.compare(password, user.password)
        if(!mdpValide)
            return res.status(401).json({message: 'Username ou mot de passe incorrect.'})

        const token=jwt.sign(
            {user_id: user.id, username:user.username},
            process.env.JWT_SECRET,
            {expiresIn: '24h'}
        )

        res.json({
            message: 'Connectee !',
            token,
            user: {id: user.id, username: user.username}
        })
    }catch(err){
        res.status(500).json({message: 'Erreur serveur.', error: err.message})
    }
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

server.listen(process.env.PORT || 3000, ()=> {
    console.log(`Serveur demarre sur http://localhost:${process.env.PORT || 3000}`)
})

