/* eslint-disable react-hooks/exhaustive-deps */
import Deck from './Deck.js';
import Player from './Player.js'
import styles from './GamePage.module.css'
import {db} from '../services/Firebase'
import { useLocation } from 'react-router';
import { useEffect, useState } from 'react'
import { IoExitOutline } from 'react-icons/io5'
import ErrorPage from './ErrorPage.js';

export default function GamePage(){
    const roomReadRef = db.ref().child(`Lobbies`)
    const location = useLocation()

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
                setPlayerList(snap.val()['players'])
            })  
        }
    }, [lobbyExist])

    useEffect(() => {
        const query = roomReadRef.orderByKey().equalTo(lobbyCode)
        query.on('value', snap => {
            setLobbyExist(snap.exists())
            setLoading(false)
        })
    }, [lobbyCode])
    
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
                    <button className={styles.exitButton} data-text="Exit">
                        {/* TODO: Exit lobby, if lobby empty, delete it */}
                        <IoExitOutline className={styles.exitIcon}/>
                        <p className={styles.exitTooltip}>Exit</p>
                    </button>
                    <p className={styles.p}>CODE: {lobbyCode}</p>
                </div>

                {/* TODO: Show current player in lobby */}
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