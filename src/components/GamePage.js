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
import { shuffleArray, getCardType, sortCard, biggerOrEqualCombo } from '../services/Helpers.js';
import { typeOf } from 'react-is';

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
    const deckQuery = roomReadRef.child(lobbyCode).child('deck')
    const playerListQuery = roomReadRef.child(lobbyCode).child('players')

    // Indicate if this lobby exist, used during loadup
    const [lobbyExist, setLobbyExist] = useState(false)
    // Indicate if the page data is still being loaded
    const [loading, setLoading] = useState(true)
    // Indicate if the game has started already
    const [startGame, setStartGame] = useState(false)
    // Indicate if someone wins the game
    const [gameEnded, setGameEnded] = useState(false)
    // Indicate the previous winner
    const [prevWinner, setPrevWinner] = useState(false)

    // Text displayed when submition of cards is not successful
    const [submitError, setSubmitError] = useState('')
    // Indicate which player's turn is it
    const [playerTurn, setPlayerTurn] = useState('')
    // A dictionary that contains information of all player
    const [playerObjDict, setPlayerObjDict] = useState([])
    
    var localPlayerKey = Object.keys(playerObjDict).find(key => playerObjDict[key].name === localPlayerName)
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

            roomReadRef.child(`${lobbyCode}`).on('value', snap => {
                if(snap.exists()){
                    setStartGame(snap.val()['started'])
                    setGameEnded(snap.val()['gameEnded'])
                    setPrevWinner(snap.val()['prevWinner'])
                }
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
                // const playerDeckQuery = roomReadRef.child(`${lobbyCode}/players/${playerKeys[0]}/cards`)
                playerDeckQuery.push({cardType: initialDeck[i]})

                if(initialDeck[i] === '03D') roomReadRef.child(lobbyCode).update({playerTurn: playerObjDict[playerKeys[(playerIndex - 1) % playerKeys.length]]['name']})
            }
        }
    }, [startGame])

    useEffect(() => {
        localPlayerKey = Object.keys(playerObjDict).find(key => playerObjDict[key].name === localPlayerName)

        // Make sure the ready words and buttons doesn't dissapear too suddently
        if(!startGame){
            setTimeout(() => {
                // Only allow game to start if all player click ready, if only 1 player, clicking ready won't start
                if(Object.keys(playerObjDict).length > 1 && typeof(Object.values(playerObjDict).find(obj => obj.ready === false)) === 'undefined') {
                    roomReadRef.child(`${lobbyCode}`).update({started: true})
                }
            }, 1000);
        }else{
            if(gameEnded){
                roomReadRef.child(`${lobbyCode}`).update({
                    started: false,
                    gameEnded: false
                })

                roomReadRef.child(`${lobbyCode}`).child('deck').set({
                    cards: '',
                    deckType: '',
                    largestCardInDeck: '',
                    emoji: '',
                    placedBy: ''
                })

                Object.keys(playerObjDict).forEach((playerKey) => {
                    playerListQuery.child(`${playerKey}`).update({
                        cards: '',
                        ready: false
                    })
                })
            }
        }

    }, [playerObjDict])


    const alertUser = e => {
        e.preventDefault()
        e.returnValue = ''  
    }

    const playerReadyHandler = () => {
        const playerQuery = roomReadRef.child(lobbyCode).child(`/players/${localPlayerKey}`)

        playerQuery.once('value', snap => {
            playerQuery.set({
                ...snap.val(),
                ready: true
            })  
        })
    }

    // When player clicked submit
    // Change player turn on the server, only change by the host
    // PARAM: cards: array 
    //        type: string
    const onPlayerSubmitHandler = (cards) => {
        if(cards.length === 0) 
            return

        if(playerTurn === localPlayerName){
            var deckType = ''
            var largestCardInDeck = ''

            deckQuery.once('value', snap => {
                if(snap.exists()){
                    deckType = snap.val()['deckType']
                    largestCardInDeck = snap.val()['largestCardInDeck']

                    var info = getCardType(cards)
                    // Update deck
                    // Check if cards submitted is valid (bigger than the cards played in the deck, valid combo)
                    if(info[1] === -1){
                        setSubmitError('Invalid Cards')
                        return
                    }else if(deckType === '' || biggerOrEqualCombo(info[0], deckType)){
                        if(info[0] === deckType){ // If same combo, check for largest card in deck
                            if(sortCard(info[1], largestCardInDeck) > 0)
                                deckQuery.set({
                                    cards: cards,
                                    deckType: info[0],
                                    largestCardInDeck: info[1],
                                    emoji: info[2],
                                    placedBy: localPlayerName
                                })
                            else{ // same combo, smaller value
                                setSubmitError('Invalid Cards')
                                return
                            } 
                        }else // cards is bigger than deck's cards
                            deckQuery.set({
                                cards: cards,
                                deckType: info[0],
                                largestCardInDeck: info[1],
                                emoji: info[2],
                                placedBy: localPlayerName
                            })
                    }else{ // Cards submitted is imcompatible with deck
                        setSubmitError('Invalid Cards')
                        return
                    }

                    // Remove cards from player's deck
                    cards.forEach(card => {
                        let cardKey = Object.keys(playerObjDict[localPlayerKey]['cards']).find(key => playerObjDict[localPlayerKey]['cards'][key].cardType === card)
                        playerListQuery.child(`${localPlayerKey}/cards/${cardKey}`).remove()
                    })

                    if(Object.keys(playerObjDict[localPlayerKey]['cards']).length - cards.length === 0){
                        roomReadRef.child(`${lobbyCode}`).update({
                            gameEnded: true,
                            prevWinner: localPlayerName
                        })
                    }

                    // Update player Turn
                    const keys = Object.keys(playerNameNumberDict)
                    const nextNumber = (keys.indexOf(playerTurn) + 1) % keys.length
                    roomReadRef.child(lobbyCode).update({playerTurn: keys[nextNumber]})

                    setSubmitError('')
                }
            })
        }else{
            setSubmitError("It's not your turn yet, I beg you to patiently wait")
        }
    }

    const onPlayerSkipHandler = () => {
        if(playerTurn === localPlayerName){
            // Update player Turn
            const keys = Object.keys(playerNameNumberDict)
            const nextNumber = (keys.indexOf(playerTurn) + 1) % keys.length
            roomReadRef.child(lobbyCode).update({playerTurn: keys[nextNumber]})

            // If the next player is the person that last placed the card, refresh the deck info
            const deckQuery = roomReadRef.child(`${lobbyCode}/deck`)
            deckQuery.once('value', snap => {
                if(snap.val()['placedBy'] === keys[nextNumber]){
                    deckQuery.update({
                        deckType: '',
                        largestCardInDeck: '',
                        emoji: '',
                        placedBy: ''
                    })
                }
            })
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
                        {prevWinner !== '' && <p className={styles.submitInfoText}>CONGRATUALTIONS, WINNER IS {prevWinner}!!!ヽ(•‿•)ノ</p>}
                        <div className={styles.rowContainer}>
                            {Object.values(playerObjDict).map(player =>  <img key={player.name} src={player.ready ? circleFilled : circle} className={styles.readyCircle} alt='ready button'/> )}
                        </div>
                        <button className={styles.playButton} onClick={playerReadyHandler}>{`${prevWinner === '' ? 'Ready?' : 'Go again?'}`}</button> 
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
                    
                    return(<Player turn={playerObj['name'] === playerTurn} key={assignedNumber} onSubmit={onPlayerSubmitHandler} onSkip={onPlayerSkipHandler}
                    playerData={playerObj} playerIndex={index} lobbyCode={lobbyCode} playerNo={assignedNumber}>{playerObj['name']}</Player>)
                })}
                {startGame && <Deck playerTurnNumber={playerNameNumberDict[playerTurn]} lobbyCode={lobbyCode}/>}
                {submitError !== '' && 
                <div className={styles.submitInfoContainer}>
                    <h1 className={styles.submitInfoText}>{submitError}</h1>
                </div>}
            </div> 
            : <ErrorPage>404 Lobby not found</ErrorPage>
        )
    }
}