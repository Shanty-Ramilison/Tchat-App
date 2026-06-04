import { useState } from "react";

function Login({onLogin}){
    const [username, setUsername]=useState('')
    const [password, setPassword]=useState('')
    const [isRegister, setIsRegister]=useState(false)
    const [erreur, setErreur]=useState('')
    const [loading, setLoading]=useState(false)

    const handleSubmit=async()=>{
        if(!username.trim || !password.trim()){
            setErreur('Veuillez remplir tous les champs.')
            return
        }
        setLoading(true)
        setErreur('')

        try{
            const route = isRegister ? 'register' : 'login'

            const res=await fetch(`http://localhost:3000/api/auth/${route}`, {
                method:'POST',
                headers:{'Content-Type': 'application/json'},
                body:JSON.stringify({username, password})
            })

            const data=await res.json()

            if (!res.ok){
                setErreur(data.message)
                return
            }

            if (isRegister){
                setIsRegister(false)
                setErreur('')
                setUsername('')
                setPassword('')
                alert('Compte cree ! Connectez-vous.')
            }else{
                onLogin({
                    id:data.user.id,
                    username:data.user.username,
                    token:data.token
                })
            }
        } catch{
            setErreur('Erreur de connexion au serveur.')
        }
        setLoading(false)
    }
    return (
        <div className="bg-gray-900 h-screen flex items-center justify-centre">
            <div className="bg-gray-800 p-8 rounded-2xl flex flex-col gap-4 w-80">
                <h2 className="text-white text-2xl font-bold">
                    {isRegister ? '📝 Creez un compte': '🔐 Connexion'}
                </h2>
                {erreur &&(
                    <p className="text-red-400 text-sm">{erreur}</p>
                )}
                <input
                className="bg-gray-900 text-white p-3 rounded-lg outline-none border border-gray-700"
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={(e)=> setUsername(e.target.value)}
                onKeyDown={(e)=> e.key=='Enter' && handleSubmit()} 
                />
                <input
                type="password"
                className="bg-gray-900 text-white p-3 rounded-lg outline-none border border-gray-700"
                placeholder="Mot de passe"
                value={password}
                onChange={(e)=> setPassword(e.target.value)}
                onKeyDown={(e)=> e.key === 'Enter' && handleSubmit()}
                />
                <button 
                className="bg-violet-600 text-white p-3 rounded-lg font-bold hover:bg-violet-700 disabled:opacity-50"
                onClick={handleSubmit}
                disabled={loading}
                >
                {loading ? 'Chargement...': isRegister ? 'Creer le compte' : 'Se connecter'}
                </button>

                <p className="text-gray-400 text-sm text-center">
                    {isRegister ? 'Deja un compte ?' : 'Pas encore de compte ?'}
                    <button className="text-violet-400 ml-1 hover:underline"
                    onClick={()=>{
                        setIsRegister(!isRegister)
                        setErreur('')
                    }}>
                        {isRegister ? 'Se connecter' : "S'inscire"}
                    </button>
                </p>
            </div>
        </div>
    )
}
export default Login