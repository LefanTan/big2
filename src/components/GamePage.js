/* eslint-disable react-hooks/exhaustive-deps */
import Deck from './Deck.js';
import Player from './Player.js'
import styles from './GamePage.module.css'
import {db} from '../services/Firebase'
import { useLocation, useHistory } from 'react-router';
import { useEffect, useState } from 'react'
import { IoExitOutline } from 'react-icons/io5'
import ErrorPage from './ErrorPage.js';
import cardTypes from '../data structure/deck.json';
import circle from '../assets/circle.png';
import circleFilled from '../assets/circle-filled.png';

export default function GamePage(){
    const roomReadRef = db.ref().child(`Lobbies`)
    const location = useLocation()
    const history = useHistory()

    const [lobbyExist, setLobbyExist] = useState(false)
    const [loading, setLoading] = useState(true)
    const [startGame, setStartGame] = useState(false)
    const [playerObjDict, setPlayerObjDict] = useState([])

    const lobbyStrIndex = location.search.indexOf('code=')
    const nameStrIndex = location.search.indexOf('name=')

    // Get the lobby code and local player name from the Url
    const lobbyCode = location.search.substring(lobbyStrIndex + 5, nameStrIndex - 1)
    const localPlayerName = location.search.substring(nameStrIndex + 5)
    
    var initialDeck = cardTypes;
    var startingPlayerNo = 2

    useEffect(() => {
        if(lobbyExist){
            const playerListQuery = roomReadRef.child(lobbyCode)
            playerListQuery.on('value', snap => {
                if(snap.exists()) {setPlayerObjDict(snap.val()['players'])}
            })  
        }
    }, [lobbyExist])

    useEffect(() => {
        window.addEventListener('beforeunload', alertUser)
        window.addEventListener('unload', exitClickedHandler)
        return () => {
            window.removeEventListener('beforeunload', alertUser)
            window.removeEventListener('unload', exitClickedHandler)
        }
    }) 

    useEffect(() => {
        if(startGame){
            // TODO: Deal cards
            
        }
    }, [startGame])

    useEffect(() => {
        // Make sure the ready words and buttons doesn't dissapear too suddently
        setTimeout(() => {
            if(Object.keys(playerObjDict).length > 0 && typeof(Object.values(playerObjDict).find(obj => obj.ready === false)) === 'undefined') setStartGame(true)
        }, 1000);
    }, [playerObjDict])

    useEffect(() => {
        const query = roomReadRef.orderByKey().equalTo(lobbyCode)
        query.once('value', snap => {
            setLobbyExist(snap.exists())
            setLoading(false)
        })
    }, [lobbyCode])

    const alertUser = e => {
        e.preventDefault()
        e.returnValue = ''  
    }

    const playerReadyHandler = () => {
        const playerKey = Object.keys(playerObjDict).find(key => playerObjDict[key].name === localPlayerName)
        const playerQuery = roomReadRef.child(lobbyCode).child(`/players/${playerKey}`)

        playerQuery.once('value', snap => {
            playerQuery.set({
                ...snap.val(),
                ready: true
            })  
        })
    }

    // Handles when local player exit the game lobby
    // If last person to exit, delete the lobby
    const exitClickedHandler = () => {
        Object.entries(playerObjDict).forEach(([k, v]) => {
            if(v.name === localPlayerName){
                // Remove the player from the players list
                roomReadRef.child(`${lobbyCode}/players/${k}`).remove()
            }
        })

        const playerListQuery = roomReadRef.child(`${lobbyCode}/players`)
        playerListQuery.once('value', snap => {
            if(!snap.exists()) roomReadRef.child(lobbyCode).remove()
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
                {!startGame && 
                    <div className={styles.playerReadyContainer}>
                        <div className={styles.rowContainer}>
                            {Object.values(playerObjDict).map(player =>  <img key={player.name} src={player.ready ? circleFilled : circle} className={styles.readyCircle} alt='ready button'/> )}
                        </div>
                        <button className={styles.playButton} onClick={playerReadyHandler}>Ready!</button> 
                        <p className={styles.words}>only click if you're actually ready of course ☉_☉</p>
                    </div>
                }
                <div className={styles.userCorner}>
                    <button className={styles.exitButton} onClick={() => exitClickedHandler()}>
                        <IoExitOutline className={styles.exitIcon}/>
                        <p className={styles.exitTooltip}>Exit</p>
                    </button>
                    <p className={styles.p}>CODE: {lobbyCode}</p>
                </div>

                {Object.values(playerObjDict).map((playerObj, index) => {
                    // Make sure local player gets 1 as assigned number, and everyone else starts from 2
                    const assignedNumber = playerObj['name'] === localPlayerName ? 1 : startingPlayerNo++
                    return(<Player key={assignedNumber} playerData={playerObj} playerIndex={index} lobbyCode={lobbyCode} playerNo={assignedNumber}>{playerObj['name']}</Player>)
                })}
                <Deck lobbyCode={lobbyCode}/>
            </div> 
            : <ErrorPage>404 Lobby not found</ErrorPage>
        )
    }
}