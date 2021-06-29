import { useState } from 'react'
import {db} from '../services/Firebase'
import styles from './LobbyPage.module.css'

export default function LobbyPage(){
    var [lobbyCode, setLobbyCode] = useState('')
    var [playerName, setPlayerName] = useState('')

    const roomReadRef = db.ref().child(`Lobbies`)

    /* Check if player name field is filled, if not, show an alert and return false */
    const playerNameFilled = () => {
        if(playerName.length === 0){
            alert('Please enter a name')
            return false
        }
        return true
    }

    const lobbyEnterHandler = (e) => {
        if(!playerNameFilled())
            return

        const query = roomReadRef.orderByKey().equalTo(lobbyCode)

        query.on('value', snap => {
            if(snap.exists())
                console.log("Lobby exist...entering lobby")
            else
                console.log("Lobby doesn't exist")
        })
        setLobbyCode('')
    }

    /* Random Code Generator: Generate 4 letter combination, each letter is random from 0-9, A-Z.  */
    const randomAlphaNumericGenerator = () => {
        // Generate a number from 0 - 35 
        // If number is 0 - 9, convert directly to char
        // if number is 10-35, add 55 to get ASCII code of Alphabet letter
        var randomNo = Math.floor(Math.random() * 36)
        
        if(randomNo < 10) return randomNo.toString()
        else return String.fromCharCode(55 + randomNo)
    }

    const lobbyCreateHandler = (e) => {
        e.preventDefault()

        if(!playerNameFilled())
            return
        
        // Generate 4 letter code
        lobbyCode = randomAlphaNumericGenerator() + randomAlphaNumericGenerator() + randomAlphaNumericGenerator() + randomAlphaNumericGenerator()

        // Check if the generated code already exist, if so, generate again
        const query = roomReadRef.orderByKey().equalTo(lobbyCode)
        query.on('value', snap => {
            if(snap.exists()){
                lobbyCode = randomAlphaNumericGenerator() + randomAlphaNumericGenerator() + randomAlphaNumericGenerator() + randomAlphaNumericGenerator()
            }
        })

        const roomWriteRef = db.ref().child(`Lobbies/${lobbyCode}`)
        roomWriteRef.set({
            id: lobbyCode,
            players: [playerName, 'Tian']
        })
    }

    return(
        <div className={styles.Container}>
            <p>LOBBY CODE</p>
            <form onSubmit={lobbyEnterHandler}>
                <input value={lobbyCode} onChange={(e) => setLobbyCode(e.target.value.toUpperCase())} type="text"/>
                <button type="submit">Enter</button>
                <button onClick={lobbyCreateHandler}>Create Room</button>
            </form>
        
            <p>PLAYER NAME</p>
            <input value={playerName} onChange={(e) => setPlayerName(e.target.value)} type="text"/>
        </div>
    )
}