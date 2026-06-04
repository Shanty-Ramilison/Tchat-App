import { useState, useEffect, useRef } from "react" 
//recharge la page quand elle change, du code qui tourne automatiquement, pointer vers un element html
import {io} from 'socket.io-client'

function Chat({user}){
    const [messages, setMessages]=useState([]);
    const [input, setInput]=useState('');
    const bottomRef=useRef(null); //pour scroller automatiquement 
    const [connectes, setConnectes]=useState(0);
    const [typing, setTyping]=useState('');
    const typingTimeoutRef=useRef(null);
    const socketRef= useRef(null)

useEffect(()=>{
    socketRef.current= io('http://localhost:3000')

    socketRef.current.on('message', (data)=>{
        setMessages((prev)=>[...prev, data])
    })
    socketRef.current.on('connectes', (nombre)=>{
        setConnectes(nombre)
    })
    //ecoute qui est en train de taper
    socketRef.current.on('typing', (pseudo)=>{
        setTyping(pseudo)
    })
    socketRef.current.on('stopTyping', ()=>{
        setTyping('')
    })
    return ()=>{
        socketRef.current.disconnect()
    }
},[])

//scroll automatique avec arriver d'un nouveau message
useEffect(()=>{
    bottomRef.current?.scrollIntoView({behavior: 'smooth'})
},[messages])

//Envoyer un message
const sendMessage=()=>{
    if (input.trim()==='') return
    socketRef.current.emit('message', {pseudo: user.username, text:input})
    setInput('')
}

//Pour envoyer avec "Entrer"
const handleKey=(e)=>{
    if (e.key==='Enter') sendMessage()
}


return(
    <div className="bg-gray-900 h-screen flex flex-col">
        <div className="bg-gray-800 px-6 py-4 flex justify-between items-center border-b border-gray-700">
            <span className="text-white font-bold text-lg ">💬 Tchat </span>
            <span className="text-gray-400 text-sm">Connectee en tant que <b className="text-white">{user.username}</b></span>
            <span className="text-green-400 text-sm">🟢 {connectes} en ligne</span>
        </div>       
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3">
            {messages.map((msg, i)=>{
                const isMe=msg.pseudo ===user.username
                return (
                    <div key={i} className={`flex items-end gap-2 ${isMe ? 'justify-end' :'justify-start'}`}>
                        {/**Avatar*/}
                        {!isMe && (
                            <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm font-bold">
                                {msg.pseudo[0].toUpperCase()}
                            </div>
                        )}
                        {/**bulle de message */}
                        <div className={`max-w-xs px-4 py-2 rounded-2xl flex flex-col ${isMe ? 'bg-violet-600 items-end' : 'bg-gray-700 items-start'}`}>
                            {!isMe && <span className="text-gray-400 text-xs font-bold mb-1">{msg.pseudo}</span>}
                            <span className="text-white text-sm">{msg.text}</span>
                        </div>
                    </div>
                )
            })}
            <div ref={bottomRef}/>
             {typing && (
                <p className="text-gray-400 text-xs px-6 pb-1 italic animate-pulse">
                    ✍️ {typing} est en train d'ecrire...
                </p>
            )}
        </div>
        {/*input*/}
        <div className="bg-gray-800 px-6 py-4 flex gap-3 border-t border-gray-700">
            <input 
            className="flex-1 bg-gray-900 text-white p-3 rounded-lg outline-none border border-gray-700"
            placeholder="Envoyer un message..."
            value={input}
            onChange={(e)=>{
                setInput(e.target.value)

                socketRef.current.emit('typing', user.username)

                clearTimeout(typingTimeoutRef.current)
                typingTimeoutRef.current=setTimeout(() => {
                    socketRef.current.emit('stopTyping')
                },1500)
            }}
            onKeyDown={handleKey}
            />
            <button className="bg-violet-600 text-white px-6 rounded-lg font-bold hover:bg-violet-700"
            onClick={sendMessage}>Envoyer</button>
        </div>
    </div>
)
}
export default Chat
