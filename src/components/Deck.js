/* eslint-disable react-hooks/exhaustive-deps */
import styles from './Deck.module.css'
import { db } from '../services/Firebase'
import { useEffect, useState, useRef } from 'react'

export default function Deck (props){
    const [chatList, setChatList] = useState([])
    const messageEndRef = useRef(null)

    // Connect deck to firebase
    useEffect(() => {
        const deckRef = db.ref().child('Lobbies').child(props.lobbyCode).child('deck')
        deckRef.on('value', snap => {
            if(snap.exists()) {
                setChatList(Object.values(snap.val()))
            }
        })
    }, [])

    useEffect(() => {
        messageEndRef.current.scrollIntoView({behavior: "smooth"})
    }, [chatList])

    return(
        <div className={styles.Container}>
            {chatList.map((chat, index) =>
                <p key={chat + index}>{chat['content']} - {chat['sender']}</p>
            )}
            <div ref={messageEndRef}/>
        </div>
    )
}