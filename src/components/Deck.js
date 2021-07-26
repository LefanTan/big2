/* eslint-disable react-hooks/exhaustive-deps */
import styles from './Deck.module.css'
import styled, { keyframes } from 'styled-components'
import { db } from '../services/Firebase'
import Card from './Card.js'
import {BiDownArrow, BiUpArrow, BiLeftArrow, BiRightArrow} from 'react-icons/bi'
import { useEffect, useState } from 'react'

export default function Deck (props){
    const [cardList, setCardList] = useState([])
    const [deck, setDeck] = useState()

    // Connect deck to firebase
    useEffect(() => {
        const deckRef = db.ref().child('Lobbies').child(props.lobbyCode).child('deck')
        deckRef.on('value', snap => {
            if(snap.exists()){
                if(snap.val()['cards'] !== '') setCardList(snap.val()['cards'])
                setDeck(snap.val())
            } 
        })
    },[])

    // STYLES
    const pulseAnimationVertical = keyframes`
        0% {transform: translate(0)}
        50% {transform: translate(0, 5px)}
        100% {transform: translate(0)}
    `
    const pulseAnimationHorizontal = keyframes`
        0% {transform: translate(0)}
        50% {transform: translate(5px, 0)}
        100% {transform: translate(0)}
    `

    var ArrowDiv = {}
    var arrowIconStyle = {
        color: 'var(--secondary-color)',
        width: `${props.playerTurnNumber < 3 ? 'auto' : '32.5%'}`,
        height: `${props.playerTurnNumber < 3 ? '70%' : 'auto'}`,
        marginBottom: `${props.playerTurnNumber === 1 ? 3 : 0}%`
    }
    
    // default icon
    var arrowIcon = <BiDownArrow style={arrowIconStyle}/>
    switch(props.playerTurnNumber){
        case 1:
            ArrowDiv = styled.div`
                display: flex;
                justify-content: center;
                align-items: center;
                pointer-events: none;

                width: 100%;
                height: auto;
                grid-row-start: 3;
                grid-column: 2;
                animation: ${pulseAnimationVertical} 1.5s ease-in-out;
                animation-iteration-count: infinite;
            `
            arrowIcon = <BiDownArrow style={arrowIconStyle}/>
            break
        case 2:
            ArrowDiv = styled.div`
                display: flex;
                justify-content: center;
                align-items: center;

                width: 100%;
                height: auto;
                grid-row-start: 1;
                grid-column: 2;
                animation: ${pulseAnimationVertical} 1.5s ease-in-out;
                animation-iteration-count: infinite;
            `
            arrowIcon = <BiUpArrow style={arrowIconStyle}/>
            break
        case 3:
            ArrowDiv = styled.div`
                display: flex;
                justify-content: center;
                align-items: center;
                
                width: 100%;
                height: auto;
                grid-row: 2;
                grid-column-start: 3;
                animation: ${pulseAnimationHorizontal} 1.5s ease-in-out;
                animation-iteration-count: infinite;
            `
            arrowIcon = <BiRightArrow style={arrowIconStyle}/>
            break
        case 4:
            ArrowDiv = styled.div`
                display: flex;
                justify-content: center;
                align-items: center;

                width: 100%;
                height: auto;
                grid-row: 2;
                grid-column-start: 1;
                animation: ${pulseAnimationHorizontal} 1.5s ease-in-out;
                animation-iteration-count: infinite;
            `
            arrowIcon = <BiLeftArrow style={arrowIconStyle}/>
            break
        default:
            console.log('undefined deck player turn')
    }

    return(
        <div className={styles.Container}>
            {props.playerTurnNumber && <ArrowDiv>{arrowIcon}</ArrowDiv>}
            <div className={styles.DeckContainer}>
                {cardList.length > 0 && cardList.map((cardType, index) => <Card key={cardType} width='15' left={(100 - cardList.length * 15) / 2 + index * 15} cardType={cardType}/>)}
                {(deck && deck['deckType'] !== '') && <h3 className={styles.h3}>{deck['deckType'].toUpperCase()} {deck['emoji']}</h3>}
                {(deck && deck['placedBy'] !== '') && <p className={styles.p}>Placed By: {deck['placedBy']}</p>}
            </div>
        </div>
    )
}