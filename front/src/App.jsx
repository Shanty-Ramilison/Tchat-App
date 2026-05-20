/*import {useState, useEffect} from 'react'
import {io} from 'socket.io-client'

const socket= io('http://localhost:3000')
function App(){
    const [messages, setMessages]=useState([])
    const[input, setInput]=useState('')
    useEffect(()=> {
        socket.on('message', (data) => {
            setMessages((prev)=> [...prev, data])
            })
        return ()=> socket.off('message')
    },[])
    const  sendMessage=()=>{
        if (input.trim() ==='')return
        socket.emit('message', input)
        setInput('')
    }
    return(
        <div>
            <h1>Tchat</h1>
            <div>
                {messages.map((msg, index)=>(
                    <p key={index}>{msg}</p>
                ))}
            </div>
            <input 
            value={input}
            onChange={(e)=>setInput(e.target.value)}
            placeholder="Tape un message..." 
            />
            <button onClick={sendMessage}>Envoyer</button>

        </div>
    )
}
export default App */

import Chat from './Chat'
function App(){
  return <Chat/>
}
export default App 