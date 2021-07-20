import { getCardImage } from '../services/Helpers';
import { useState } from 'react';

/* PROPS:
cardType
cardClickedHandler
*/
export default function Card(props){
    const [hovered, setHovered] = useState(false)
    const [active, setActive] = useState(false)
    const toggleHovered = () => setHovered(!hovered)
    const toggleActive = () => setActive(!active)

    var cardButtonStyle = {
        position: 'absolute',
        left: `${props.left}%`,
        right: `${props.right}%`,
        top: `${props.clicked ? -10 : props.top}%`,
        padding: '0%',
        border: '0',
        backgroundColor: 'transparent',
        width: `${props.width}%`,
        height: `${props.height}%`
    }

    const yShadowDistance = props.height === 'auto' ? 2 : 1
    var imgStyle = {
        width: '100%',
        height: `${props.height === 'auto' ? 'auto' : '100%'}`,
        filter: `drop-shadow(-1px ${yShadowDistance}px 1px #6a6161)`,
        margin: '0%',
        padding: '0%'
    }

    var hoveredImgStyle = {
        ...imgStyle,
        filter: `brightness(0.925) drop-shadow(-1px ${yShadowDistance}px 1px #6a6161)`
    }

    var activeImgStyle = {
        ...imgStyle,
        filter: `brightness(0.85) drop-shadow(-1px ${yShadowDistance}px 1px #6a6161)`
    }

    return(
        <button style={cardButtonStyle} onClick={() => !props.cardType.includes('back') && props.cardClickedHandler(props.cardType)}>
            <img style={hovered && !props.cardType.includes('back') ? (active ? activeImgStyle : hoveredImgStyle) : imgStyle} 
            onMouseDown={toggleActive} onMouseUp={toggleActive} onMouseEnter={toggleHovered} onMouseLeave={toggleHovered} src={getCardImage(props.cardType)} alt='card'/>
        </button>
    )
}