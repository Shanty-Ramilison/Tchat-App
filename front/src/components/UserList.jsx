function UserList({users, currentUser }){
    return(
        <div className="w-48 bg-gray-800 border-r border-gray-700 flex flex-col">
            <div className="px-4 py-3 border-b border-gray-700">
                <h3 className="text-gray-400 text-xs font-bold uppercase">
                    👥 En ligne ({users.length}) 
                </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
                {users.map((username, i)=>(
                    <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg
                    ${'username===currentUser ? bg-violet-600/20 : hover:bg-gray-700'}`}>
                        <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold">
                            {username[0].toUpperCase()}
                        </div>

                        <span className={`text-sm ${username===currentUser ? 'text-violet-300 font-bold' : 'text-gray-300'}`}>
                            {username}
                            {username===currentUser && <span className="text-xs text-gray-400 ml-1">(toi)</span>}
                        </span>
                        <div className="w-2 h-2 rounded-full bg-green-400 ml-auto"></div>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default UserList