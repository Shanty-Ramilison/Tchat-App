import Login from './components/Login'
import Chat from './components/Chat'
import { useState } from 'react'

function App(){
  //null=pas connectee, sinon stocke les infos de l'user 
  const [user, setUser]=useState(null)

  if (!user){
    return <Login onLogin={setUser}></Login>
  }
  return <Chat user={user}/>
}
export default App 