import styles from './Popup.module.css'
import {IoCloseCircleOutline} from 'react-icons/io5'

export default function Popup(props){
    return( 
        props.trigger &&
        <div className={styles.popup}>
            <div className={styles.popupContent}>
                {props.children}
                <button onClick={props.onCloseButtonClicked} className={styles.closeButton}><IoCloseCircleOutline className={styles.closeIcon}/></button>
            </div>
        </div> 
    )
}