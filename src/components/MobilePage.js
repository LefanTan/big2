import styles from './MobilePage.module.css'
import moan from '../assets/moan.png'

export default function MobilePage(){
    return(
        <div className={styles.Container}>
            <img className={styles.moanImg} src={moan} alt='moan'/>
            <h1 className={styles.h1}>This game is not available for mobile phones, sorry (too much effort)</h1>
        </div>
    )
}