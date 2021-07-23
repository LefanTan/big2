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
    const location = useLocation()
    const history = useHistory()

    const lobbyStrIndex = location.search.indexOf('code=')
    const nameStrIndex = location.search.indexOf('name=')
    // Get the lobby code and local player name from the Url
    const lobbyCode = location.search.substring(lobbyStrIndex + 5, nameStrIndex - 1)
    const localPlayerName = location.search.substring(nameStrIndex + 5)

    const roomReadRef = db.ref().child(`Lobbies`)
    const playerTurnQuery = roomReadRef.child(lobbyCode).child('playerTurn')
    const playerListQuery = roomReadRef.child(lobbyCode).child('players')

    // Indicate if this lobby exist, used during loadup
    const [lobbyExist, setLobbyExist] = useState(false)
    // Indicate if the page data is still being loaded
    const [loading, setLoading] = useState(true)
    // Indicate if the game has started already
    const [startGame, setStartGame] = useState(false)

    // Indicate which player's turn is it
    const [playerTurn, setPlayerTurn] = useState('')
    // A dictionary that contains information of all player
    const [playerObjDict, setPlayerObjDict] = useState([])

    var isHost = Object.values(playerObjDict).find(x => x['host'] === true && x['name'] === localPlayerName)
    var playerNameNumberDict = {}
    var initialDeck = cardTypes;
    // Used when assigning player No to players 
    var currentPlayerNo = 2

    // update player obj dict and playerTurn variable of the database
    useEffect(() => {
        if(lobbyExist){
            playerListQuery.on('value', snap => {
                if(snap.exists()) setPlayerObjDict(snap.val())
            })  
            
            playerTurnQuery.on('value', snap => {
                if(snap.exists()) setPlayerTurn(snap.val())
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

    // // Set up window unload/closed events
    // useEffect(() => {
    //     window.addEventListener('beforeunload', alertUser)
    //     window.addEventListener('unload', exitClickedHandler)
    //     return () => {
    //         window.removeEventListener('beforeunload', alertUser)
    //         window.removeEventListener('unload', exitClickedHandler)
    //     }
    // }) 

    // Card dealing
    useEffect(() => {
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
                const playerDeckQuery = roomReadRef.child(`${lobbyCode}/players/${playerKeys[playerIndex++ % playerKeys.length]}/cards`)
                playerDeckQuery.push({cardType: initialDeck[i]})
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

    // When player clicked submit
    // Change player turn on the server, only change by the host
    const onPlayerSubmitHandler = () => {
        if(playerTurn === localPlayerName){
            const keys = Object.keys(playerNameNumberDict)
            const nextNumber = (keys.indexOf(playerTurn) + 1) % keys.length
    
            console.log({key: keys[nextNumber], nextNumber, playerTurn: playerTurn, dict: playerNameNumberDict})
            roomReadRef.child(lobbyCode).update({playerTurn: keys[nextNumber]})
        }
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
                    const assignedNumber = playerObj['name'] === localPlayerName ? 1 : currentPlayerNo++
                    playerNameNumberDict[playerObj['name']] = assignedNumber
                    
                    return(<Player turn={playerObj['name'] === playerTurn} key={assignedNumber} onSubmit={onPlayerSubmitHandler}
                    playerData={playerObj} playerIndex={index} lobbyCode={lobbyCode} playerNo={assignedNumber}>{playerObj['name']}</Player>)
                })}
                {startGame && <Deck playerTurnNumber={playerNameNumberDict[playerTurn]} lobbyCode={lobbyCode}/>}
            </div> 
            : <ErrorPage>404 Lobby not found</ErrorPage>
        )
    }
}