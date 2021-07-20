import { getCardImage } from '../services/Helpers';
import styles from './Card.module.css';

/* PROPS:
cardType
cardClickedHandler
*/
export default function Card(props){
    var cardButtonStyle = {
        position: 'absolute',
        left: `${props.left}%`,
        right: `${props.right}%`,
        top: `${props.top}% `,
        padding: '0%',
        border: '0',
        backgroundColor: 'transparent',
        width: `${props.width}%`,
        height: `${props.height}%`
    }

    return(
        <button style={cardButtonStyle} onClick={() => props.cardClickedHandler(props.cardType)}> 
            <img className={props.height !== 'auto' ? styles.cardImageVertical : styles.cardImage} src={getCardImage(props.cardType)} alt='card'/>
        </button>
    )
}