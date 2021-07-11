import { useState } from 'react'
import {useHistory} from 'react-router-dom'
import {db} from '../services/Firebase'
import styles from './LobbyPage.module.css'
import leftBackground from '../assets/leftBackground.png'
import rightBackground from '../assets/rightBackground.png'

export default function LobbyPage(){
    const history = useHistory()
    var [lobbyCode, setLobbyCode] = useState('')
    const [playerName, setPlayerName] = useState('')
    const [playClicked, setPlayClicked] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const roomReadRef = db.ref().child(`Lobbies`)

    // Check if player name field is filled, if not, show an alert and return false
    const playerNameFilled = () => {
        if(playerName.length === 0){
            setErrorMsg('Please enter a name')
            return false
        }
        return true
    }

    // Handles when use click Enter to enter a lobby
    const lobbyEnterHandler = (e) => {
        e.preventDefault()

        if(!playerNameFilled())
            return

        if(lobbyCode === ''){
            setErrorMsg('Please enter a lobby code')
            return
        }

        const query = roomReadRef.orderByKey().equalTo(lobbyCode)
        query.once('value', snap => {
            if(snap.exists()){
                let playerList = snap.val()[lobbyCode]['players']

                //TODO: Display proper error here on UI
                if(playerList.length >= 4){
                    setErrorMsg("Lobby full")
                }

                const playerReadRef = roomReadRef.child(`${lobbyCode}`).child('players')
                playerReadRef.push({
                    name: playerName,
                    ready: false
                }).then(history.push({
                    pathname: process.env.REACT_APP_GAMEPAGE_URL,
                    search: `?code=${lobbyCode}&name=${playerName}`
                }))
            }
            else
                setErrorMsg("Lobby doesn't exist")
        })
        setLobbyCode('')
    }

    // Random Code Generator: Generate 4 letter combination, each letter is random from 0-9, A-Z.
    const randomAlphaNumericGenerator = () => {
        // Generate a number from 0 - 35 
        // If number is 0 - 9, convert directly to char
        // if number is 10-35, add 55 to get ASCII code of Alphabet letter
        var randomNo = Math.floor(Math.random() * 36)
        
        if(randomNo < 10) return randomNo.toString()
        else return String.fromCharCode(55 + randomNo)
    }

    // Handles when the user click "Create" button to create a new room
    const lobbyCreateHandler = (e) => {
        e.preventDefault()

        if(!playerNameFilled())
            return
        
        // Generate 4 letter code
        lobbyCode = randomAlphaNumericGenerator() + randomAlphaNumericGenerator() + randomAlphaNumericGenerator() + randomAlphaNumericGenerator()

        // Check if the generated code already exist, if so, generate again
        const query = roomReadRef.orderByKey().equalTo(lobbyCode)
        query.once('value', snap => {
            if(snap.exists()){
                lobbyCode = randomAlphaNumericGenerator() + randomAlphaNumericGenerator() + randomAlphaNumericGenerator() + randomAlphaNumericGenerator()
            }
        })

        const roomWriteRef = db.ref().child(`Lobbies/${lobbyCode}`)
        roomWriteRef.set({
            id: lobbyCode
        })
        roomWriteRef.child('players').push({
            name: playerName,
            ready: false
        })

        // Redirect to Game Page
        history.push({
            pathname: process.env.REACT_APP_GAMEPAGE_URL,
            search: `?code=${lobbyCode}&name=${playerName}`
        })
    }

    return(
        <div className={styles.Container}>
            {playClicked ? 
            <div className={styles.inputContainer}>
                <p className={styles.p}>Lobby Code</p>
                <form onSubmit={lobbyEnterHandler}>
                    <div className={styles.rowContainer}>
                        <input className={styles.inputField} value={lobbyCode} onChange={(e) => setLobbyCode(e.target.value.toUpperCase())} type="text"/>
                        <button className={styles.button} type="submit">Enter</button>
                        <p className={styles.p}>&ensp;Or&ensp;</p> <br/>
                        <button className={styles.button} onClick={lobbyCreateHandler}>Create A Room</button>
                    </div>
                </form>
                <p className={styles.p}>Player Name</p>
                <input className={styles.inputField} value={playerName} onChange={(e) => setPlayerName(e.target.value)} type="text"/> 

                {errorMsg !== '' && <h1 className={styles.errorMsg}>{errorMsg}</h1>}
            </div>
            : <button className={styles.playButton} onClick={() => setPlayClicked(true)}>Play</button>}
         
            <div className={styles.leftBackgroundContainer}>
                <img src={leftBackground} alt='leftBackground' className={playClicked ? styles.leftBackgroundClicked : styles.leftBackground}/>
            </div>
            
            <div className={styles.rightBackgroundContainer}>
                <img src={rightBackground} alt='rightBackground' className={playClicked ? styles.rightBackgroundClicked : styles.rightBackground}/>
            </div>

        </div>
    )
}