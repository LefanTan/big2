import { GetCardImage } from '../services/CardImageHelper';
import styles from './Card.module.css';

/* PROPS:
cardType
cardClickedHandler
*/
export default function Card(props){
        
    var cardButtonStyle = {
        position: 'absolute',
        left: `${props.left}`,
        right: `${props.right}`,
        padding: '0%',
        border: '0',
        backgroundColor: 'transparent',
        width: '10%'
    }

    return(
        <button style={cardButtonStyle} onClick={() => props.cardClickedHandler(props.cardType)}> 
            <img className={styles.cardImage} src={GetCardImage(props.cardType)} alt='card'/>
        </button>
    )
}