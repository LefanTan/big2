/* eslint-disable react-hooks/exhaustive-deps */
import styles from './Deck.module.css'
import styled, { keyframes } from 'styled-components'
import { db } from '../services/Firebase'
import {BiDownArrow, BiUpArrow, BiLeftArrow, BiRightArrow} from 'react-icons/bi'
import { useEffect, useState } from 'react'

export default function Deck (props){
    const [cardList, setCardList] = useState([])

    // Connect deck to firebase
    useEffect(() => {
        // const deckRef = db.ref().child('Lobbies').child(props.lobbyCode).child('deck')
        // deckRef.on('value', snap => {
        //     if(snap.exists()) {
        //         setChatList(Object.values(snap.val()))
        //     }
        // })
    })

    const pulseAnimation = keyframes`
        0% {transform: translate(0)}
        50% {transform: translate(0, -5px)}
        100% {transform: translate(0)}
    `
    var ArrowDiv = {}
    var arrowIconStyle = {
        color: 'var(--secondary-color)',
        width: `${props.playerTurnNumber < 3 ? 'auto' : '32.5%'}`,
        height: `${props.playerTurnNumber < 3 ? '70%' : 'auto'}`,
        marginBottom: `${props.playerTurnNumber === 1 ? 2 : 0}%`
    }
    
    var arrowIcon = <BiDownArrow style={arrowIconStyle}/>
    switch(props.playerTurnNumber){
        case 1:
            ArrowDiv = styled.div`
                display: flex;
                justify-content: center;
                align-items: center;

                width: 100%;
                height: auto;
                grid-row-start: 3;
                grid-column-start: 2;
                animation: ${pulseAnimation} 1.5s ease-in-out;
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
                grid-column-start: 2;
                animation: ${pulseAnimation} 1.5s ease-in-out;
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
                grid-row-start: 2;
                grid-column-start: 3;
                animation: ${pulseAnimation} 1.5s ease-in-out;
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
                grid-row-start: 2;
                grid-column-start: 1;
                animation: ${pulseAnimation} 1.5s ease-in-out;
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
        </div>
    )
}