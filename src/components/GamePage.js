import Deck from './Deck.js';
import Player from './Player.js'
import styles from './GamePage.module.css'
import {db} from '../services/Firebase'
import { useEffect, useState } from 'react'
import { IoExitOutline } from 'react-icons/io5'
import NotFoundPage from './NotFoundPage.js';

export default function GamePage({match}){
    const roomReadRef = db.ref().child(`Lobbies`)
    const [lobbyExist, setLobbyExist] = useState(false);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const query = roomReadRef.orderByKey().equalTo(match.params.lobbyCode)
        query.on('value', snap => {
            setLobbyExist(snap.exists())
            setLoading(false)
        })
    })
    
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
                    <IoExitOutline className={styles.exitIcon}/>
                    <p className={styles.exitTooltip}>Exit</p>
                    </button>
                    <p className={styles.p}>CODE: {match.params.lobbyCode}</p>
                </div>
                <Player playerNo='1'>Player1</Player>
                <Player playerNo='2'>Player2</Player>
                <Player playerNo='3'>Player3</Player>
                <Player playerNo='4'>Player4</Player>
                <Deck/>
            </div> 
            : <NotFoundPage/>
        )
    }
}