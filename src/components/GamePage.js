/* eslint-disable react-hooks/exhaustive-deps */
import Deck from './Deck.js';
import Player from './Player.js'
import styles from './GamePage.module.css'
import {db} from '../services/Firebase'
import { useLocation, useHistory } from 'react-router';
import { useEffect, useState } from 'react'
import { IoExitOutline } from 'react-icons/io5'
import { IoIosInformationCircle } from 'react-icons/io'
import ErrorPage from './ErrorPage.js';
import cardTypes from '../data structure/deck.json';
import circle from '../assets/circle.png';
import circleFilled from '../assets/circle-filled.png';
import { shuffleArray } from '../services/Helpers.js';

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

    // update player obj dict
    useEffect(() => {
        if(lobbyExist){
            const playerListQuery = roomReadRef.child(lobbyCode)
            playerListQuery.on('value', snap => {
                if(snap.exists()) {setPlayerObjDict(snap.val()['players'])}
            })  
        }
    }, [lobbyExist])

    // Before entering game
    useEffect(() => {
        const query = roomReadRef.orderByKey().equalTo(lobbyCode)
        query.once('value', snap => {
            setLobbyExist(snap.exists())
            setLoading(false)
        })
    }, [lobbyCode])

    // Set up window unload/closed events
    useEffect(() => {
        window.addEventListener('beforeunload', alertUser)
        window.addEventListener('unload', exitClickedHandler)
        return () => {
            window.removeEventListener('beforeunload', alertUser)
            window.removeEventListener('unload', exitClickedHandler)
        }
    }) 

    // Card dealing
    useEffect(() => {
        var isHost = Object.values(playerObjDict).find(x => x['host'] === true && x['name'] === localPlayerName)

        // Deal cards only if everyone is ready, and the person is a host
        if(startGame && isHost){
            shuffleArray(initialDeck)
            let playerIndex = 0
            let playerKeys = Object.keys(playerObjDict)

            // Remove all cards from players if they exist
            for(let i = 0; i < playerKeys.length; i++){
                roomReadRef.child(`${lobbyCode}/players/${playerKeys[i]}/cards`).remove()
            }
            // Loop through the cards and deal them to player with a slight delay
            for(let i = 0; i < initialDeck.length; i++){
                console.log(playerObjDict[playerKeys[playerIndex % playerKeys.length]]['name'])
                const playerDeckQuery = roomReadRef.child(`${lobbyCode}/players/${playerKeys[playerIndex++ % playerKeys.length]}/cards`)
                setTimeout(() => {
                    playerDeckQuery.push({cardType: initialDeck[i]})
                }, 1000)
            }
        }
    }, [startGame])

    useEffect(() => {
        // Make sure the ready words and buttons doesn't dissapear too suddently
        setTimeout(() => {
            // Only allow game to start if all player click ready, if only 1 player, clicking ready won't start
            if(Object.keys(playerObjDict).length > 1 && typeof(Object.values(playerObjDict).find(obj => obj.ready === false)) === 'undefined') {
                roomReadRef.child(`${lobbyCode}`).update({started: true})
                setStartGame(true)
            }
        }, 1000);
    }, [playerObjDict])


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
                        <p className={styles.words}>{typeof(Object.values(playerObjDict).find(obj => obj.ready === false)) === 'undefined' && Object.keys(playerObjDict).length === 1 
                        ? 'Hmmmm, the game needs more than 1 player to start ¯\\_( ͡❛ ͜ʖ ͡❛)_/¯' : "only click if you're actually ready, of course ☉_☉" }</p>
                    </div>
                }
                <div className={styles.userCorner}>
                    <button className={styles.cornerButton} onClick={() => exitClickedHandler()}>
                        <IoExitOutline className={styles.cornerIcon}/>
                        <p className={styles.tooltip}>Exit</p>
                    </button>
                    <p className={styles.p}>CODE: {lobbyCode}</p>
                    <button className={styles.cornerButton}>
                        <IoIosInformationCircle className={styles.cornerIcon}/>
                        <p className={styles.tooltip}>Info</p>
                    </button>
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