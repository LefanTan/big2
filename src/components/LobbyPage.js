import { useState } from 'react'
import styles from './LobbyPage.module.css'

export default function LobbyPage(){
    const [lobbyCode, setLobbyCode] = useState('')


    const lobbyCodeEnterHandler = () => {
        console.log(lobbyCode)
        setLobbyCode('')
    }

    return(
        <div className={styles.Container}>
            <p>LOBBY CODE</p>
            <form onSubmit={lobbyCodeEnterHandler}>
                <input value={lobbyCode} onChange={(e) => setLobbyCode(e.target.value.toUpperCase())} type="text"/>
                <button type="submit">Enter</button>
            </form>
        </div>
    )
}