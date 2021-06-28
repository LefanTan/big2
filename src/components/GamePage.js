import Deck from './Deck.js';
import Player from './Player.js'
import styles from './GamePage.module.css'

export default function GamePage(){
    return(
        <div className={styles.Container}>
            <Player playerNo='1'>Player1</Player>
            <Player playerNo='2'>Player2</Player>
            <Player playerNo='3'>Player3</Player>
            <Player playerNo='4'>Player4</Player>
            <Deck/>
        </div>
    )
}