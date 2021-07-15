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
    var gridTemplateRows = 0
    var gridTemplateColumns = 0
    //var playerCards = ['0AS', '0AL', '0AD', '0AC', '02D', '02S', '02C', '10C', '03D', '03C', '03S','04L', '04C', '06D', '06C', '07D', '08S', '08D', '09S', '09C', '0JS', '0JL', '0QL', '0KS', '0KL', '0KD']
    //var playerCards = ['0AS', '02C', '10C', '0AC', '02D', '02S', '02C', '10C', '03D', '03C', '03L', '03S']
    //var playerCards = ['0AS', '02C', '10C', '0AC', '02D', '02S', '02C']
    var playerCards = []

    // Update gridRowNumber and gridColumnNumber based on local player number
    switch(props.playerNo.toString()){
        case '1':
            gridRowNumber = 3
            gridColumnNumber = 3
            gridTemplateRows = '80% 20%'
            gridTemplateColumns = `100%`
            break;
        case '2':
            gridRowNumber = 2
            gridColumnNumber = 5
            gridTemplateRows = '100%'
            gridTemplateColumns = `80% 20%`
            break;
        case '3':
            gridRowNumber = 1
            gridColumnNumber = 3
            gridTemplateRows = '20% 80%'
            gridTemplateColumns = `100%`
            break;
        case '4':
            gridRowNumber = 2
            gridColumnNumber = 1
            gridTemplateRows = '100%'
            gridTemplateColumns = `20% 80%`
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
        gridTemplateRows: `${gridTemplateRows}`,
        gridTemplateColumns: `${gridTemplateColumns}`,
        justifyContent: 'center'
    }

    var userNameContainer = {
        gridRowStart: `${props.playerNo === 1 ? 2 : 1}`,
        gridColumnStart: `${props.playerNo === 2 ? 2 : 1}`,
        display: 'flex',
        flexDirection: `${props.playerNo % 2 === 0 ? 'column' : 'row'}`,
        justifyContent: 'center',
        alignItems: 'center'
    }

    var cardContainer = {
        gridRowStart: `${props.playerNo === 3 ? 2 : 1}`,
        gridColumnStart: `${props.playerNo === 4 ? 2 : 1}`,
        position: 'relative',
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
            <div style={userNameContainer}>  
                <p className={props.playerNo % 2 === 0 ? styles.userNameVertical : styles.userName}>{props.children}</p>
            </div>
            <div style={cardContainer}>
                {playerCards.map((cardType, index) => {
                    cardType = props.playerNo % 2 === 0 ? 'back-right' : (props.playerNo === 1 ? cardType : 'back')
                    var left = 0
                    var top = 0
                    var width = 'auto'
                    var height = 'auto'

                    if(props.playerNo === 1){
                        left = 90 / (playerCards.length - 1) * index
                        width = 10
                        if(playerCards.length < 10)
                            left = ((10 - playerCards.length) * 10) / 2 + index * 10
                    }else if(props.playerNo === 2){
                        height = 14.25
                        width = height * 2.25

                        // on the 14th card, put it to second row 
                        if(index >= 13){
                            left = width
                            // 12 because 13 is the max length - 1
                            top = (85.5 / 12) * (index % 13)
                        }else{
                            if(playerCards.length - 1 > 13)
                                top = (85.5 / (playerCards.length - 14)) * index
                            else
                                top = (85.5 / (playerCards.length - 1)) * index
                        }   

                        if(playerCards.length < 13 && index > 13)
                            top = ((height * 7) - (playerCards.length * height)) / 2 + index * height

                    }else if(props.playerNo === 3){
                        width = 10
                        height = width * 7.5
                        top = height * 0.333

                        left = 90 / (playerCards.length - 1) * index
                        if(playerCards.length < 10)
                            left = ((10 - playerCards.length) * 10) / 2 + index * 10
                    }else if(props.playerNo === 4){
                        height = 14.25
                        width = height * 2.25
                        left = 67.5

                        // on the 14th card, put it to second row 
                        if(index >= 13){
                            left = left - width
                            // 12 because 13 is the max length - 1
                            top = (85.5 / 12) * (index % 13)
                        }else{
                            if(playerCards.length - 1 > 13)
                                top = (85.5 / (playerCards.length - 14)) * index
                            else
                                top = (85.5 / (playerCards.length - 1)) * index
                        }   

                        if(playerCards.length < 13 && index >= 13)
                            top = ((height * 7) - (playerCards.length * height)) / 2 + index * height
                    }

                    return <Card left={left} top={top} width={width} height={height} cardClickedHandler={cardClickedHandler} cardType={cardType}/>    
                })}
            </div>
            {/* <img src={twoSpade} className={styles.cardImage} alt='t'/> */}
        </div>
    );
}