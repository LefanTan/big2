/* eslint-disable react-hooks/exhaustive-deps */
import Deck from './Deck.js';
import Player from './Player.js'
import styles from './GamePage.module.css'
import {db} from '../services/Firebase'
import { useLocation, useHistory } from 'react-router';
import { useEffect, useState } from 'react'
import { IoExitOutline } from 'react-icons/io5'
import ErrorPage from './ErrorPage.js';

export default function GamePage(){
    const roomReadRef = db.ref().child(`Lobbies`)
    const location = useLocation()
    const history = useHistory()

    const [lobbyExist, setLobbyExist] = useState(false);
    const [loading, setLoading] = useState(true)

    const lobbyStrIndex = location.search.indexOf('code=')
    const nameStrIndex = location.search.indexOf('name=')

    // Get the lobby code and local player name from the Url
    const lobbyCode = location.search.substring(lobbyStrIndex + 5, nameStrIndex - 1)
    const localPlayerName = location.search.substring(nameStrIndex + 5)

    const [playerList, setPlayerList] = useState([])
    var startingPlayerNo = 2

    useEffect(() => {
        if(lobbyExist){
            const playerListQuery = roomReadRef.child(lobbyCode)
            playerListQuery.on('value', snap => {
                if(snap.exists()) setPlayerList(snap.val()['players'])
            })  
        }
    }, [lobbyExist])

    useEffect(() => {
        const query = roomReadRef.orderByKey().equalTo(lobbyCode)
        query.once('value', snap => {
            setLobbyExist(snap.exists())
            setLoading(false)
        })
    }, [lobbyCode])
    
    // Handles when local player exit the game lobby
    // If last person to exit, delete the lobby
    const exitHandler = () => {
        const query = roomReadRef.orderByKey().equalTo(lobbyCode)
        query.once('value', snap => {
            let newPlayerList = (snap.val()[lobbyCode]['players']).filter(x => x !== localPlayerName)
            
            // set new list that doesn't contain the local player
            const lobbyReadRef = roomReadRef.child(lobbyCode)
            lobbyReadRef.set({
                players: newPlayerList
            })

            if(newPlayerList.length === 0)
                lobbyReadRef.remove()
        })

        history.push(process.env.REACT_APP_LOBBYPAGE_URL)
    }

    if(loading){
        return (
            <div className={styles.loadingContainer}>
                <h1 className={styles.h1}>Loading...</h1>
            </div>
        )
    }else{
        return( 
            lobbyExist ?
            <div className={styles.Container}>
                <div className={styles.userCorner}>
                    <button className={styles.exitButton} onClick={() => exitHandler()}>
                        <IoExitOutline className={styles.exitIcon}/>
                        <p className={styles.exitTooltip}>Exit</p>
                    </button>
                    <p className={styles.p}>CODE: {lobbyCode}</p>
                </div>

                {playerList.map((playerName) => {
                    // Make sure local player gets 1 as assigned number, and everyone else starts from 2
                    const assignedNumber = playerName === localPlayerName ? 1 : startingPlayerNo++
                    return(<Player key={assignedNumber} playerNo={assignedNumber}>{playerName}</Player>)
                })}
                <Deck/>
            </div> 
            : <ErrorPage>404 Lobby not found</ErrorPage>
        )
    }
}