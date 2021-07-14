import { useEffect, useState } from "react";
import styles from './Player.module.css';
import { db } from "../services/Firebase";
import {GetCardImage} from '../services/CardImageHelper.js';
import Card from './Card.js';

/* Prop: 
playerNo = Determines where the player will be showned locally on screen, client should always be Player1
*/
export default function Player(props){
    const [inputText, setInputText] = useState('')

    var gridRowNumber = 0
    var gridColumnNumber = 0
    //var playerCards = ['0AS', '0AL', '0AD', '0AC', '02D', '02S', '02C', '10C', '03D', '03C', '03S','04L', '04C', '06D', '06C', '07D', '08S', '08D', '09S', '09C', '0JS', '0JL', '0QL', '0KS', '0KL', '0KD']
    var playerCards = ['0AS', '02C', '10C', '0AC', '02D', '02S', '02C', '10C', '03D', '03C', '03L']
    useEffect(() => {
    }, [props.playerData])

    // Update gridRowNumber and gridColumnNumber based on local player number
    switch(props.playerNo.toString()){
        case '1':
            gridRowNumber = 3
            gridColumnNumber = 3
            break;
        case '2':
            gridRowNumber = 2
            gridColumnNumber = 5
            break;
        case '3':
            gridRowNumber = 1
            gridColumnNumber = 3
            break;
        case '4':
            gridRowNumber = 2
            gridColumnNumber = 1
            break;
        default:
            throw new Error("Invalid Player Number")
    }

    var playerContainer = {
        gridRowStart: `${gridRowNumber}`,
        gridColumnStart: `${gridColumnNumber}`,
        width: '100%',
        height: '100%',

        display: 'grid',
        gridTemplateRows: '80% 20%',
        gridTemplateColumns: '100%',
        justifyContent: 'center'
    }

    const submitHandler = (e) => {
        e.preventDefault()

        // TODO: Send text to the deck
        const deckRef = db.ref().child('Lobbies').child(props.lobbyCode).child('deck')
        deckRef.push({
            sender: props.playerData['name'],
            timestamp: Date.now(),
            content: inputText
        })
        setInputText('')
    }

    const cardClickedHandler = (cardType) => {
        console.log(cardType)
    }

    return(
        <div style={playerContainer}>
            <p className={styles.userName}>{props.children}</p>
            <div className={styles.cardContainer}>
                {playerCards.map((cardType, index) => {
                    var left = `${90 / (playerCards.length - 1) * index}%`
                    if(playerCards.length < 10)
                        left =`${((10 - playerCards.length) * 10) / 2 + index * 10}%`
                    return <Card left={left} cardClickedHandler={cardClickedHandler} cardType={props.playerNo === 1 ? cardType : 'back'}/>    
                })}
            </div>
            {/* <img src={twoSpade} className={styles.cardImage} alt='t'/> */}
        </div>
    );
}