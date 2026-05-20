import { useState, useEffect, useRef } from "react" 
//recharge la page quand elle change, du code qui tourne automatiquement, pointer vers un element html
import {io} from 'socket.io-client'

const socket= io('http://localhost:3000')

function Chat(){
    const [messages, setMessages]=useState([]);
    const [input, setInput]=useState('');
    const [pseudo, setPseudo]=useState('');
    const [pseudoConfirmed, setPseudoConfirmed]= useState(false);
    const bottomRef=useRef(null) //pour scroller automatiquement 

//ecoute les messages venant du serveur
useEffect(()=>{
    socket.on('message', (data)=>{
        setMessages((prev)=>[...prev, data])
    })
    return ()=> socket.off('message')
}, [])

//scroll automatique avec arriver d'un nouveau message
useEffect(()=>{
    bottomRef.current?.scrollIntoView({behavior: 'smooth'})
},[messages])

//Envoyer un message
const sendMessage=()=>{
    if (input.trim()==='') return
    socket.emit('message', {pseudo, text:input})
    setInput('')
}

//Pour envoyer avec "Entrer"
const handleKey=(e)=>{
    if (e.key==='Enter') sendMessage()
}

//Page 1
if(!pseudoConfirmed){
    return(
        <div className="bg-gray-900 h-screen flex items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-2xl flex flex-col gap-4 w-80">
                <h2 className="text-white text-2xl font-bold">Bienvenue</h2>
                <p className="text-gray-400 text-sm">Entrez votre pseudo : </p>
                <input 
                className="bg-gray-900 text-white p-3 rounded-lg outline-none border border-gray-700" 
                placeholder="Votre pseudo..."
                value={pseudo}
                onChange={(e)=> setPseudo(e.target.value)}
                onKeyDown={(e)=>{if (e.key==='Enter' && pseudo.trim()) setPseudoConfirmed(true)}}
                />
                <button className="bg-violet-600 text-white p-3 rounded-lg font-bold hover:bg-violet-700"
                onClick={()=> {if (pseudo.trim()) setPseudoConfirmed(true)}}>
                    Entrez dans le Tchat
                </button>
            </div>
        </div>
    )
}

//Page 2
return(
    <div className="bg-gray-900 h-screen flex flex-col">
        <div className="bg-gray-800 px-6 py-4 flex justify-between items-center border-b border-gray-700">
            <span className="text-white font-bold text-lg ">💬 Tchat </span>
            <span className="text-gray-400 text-sm">Connectee en tant que <b className="text-white">{pseudo}</b></span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3">
            {messages.map((msg, i)=>{
                const isMe=msg.pseudo ===pseudo
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
        </div>
        {/*input*/}
        <div className="bg-gray-800 px-6 py-4 flex gap-3 border-t border-gray-700">
            <input 
            className="flex-1 bg-gray-900 text-white p-3 rounded-lg outline-none border border-gray-700"
            placeholder="Tape un message..."
            value={input}
            onChange={(e)=>setInput(e.target.value)}
            onKeyDown={handleKey}
            />
            <button className="bg-violet-600 text-white px-6 rounded-lg font-bold hover:bg-violet-700"
            onClick={sendMessage}>Envoyer</button>
        </div>
    </div>
)
}
export default Chat
