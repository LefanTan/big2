import styles from './Popup.module.css'
import {IoCloseCircleOutline} from 'react-icons/io5'
import { useEffect, useRef } from 'react'

export default function Popup(props){   
    var contentRef = useRef()

    // Ideally, this can be convereted into a hook (useClickOutside)
    useEffect(() => {
        const handler = (event) => {
            if(contentRef.current && !contentRef.current.contains(event.target)){
                props.onCloseButtonClicked()
            }
        }
        document.addEventListener("mousedown", handler)
        return () => {
            document.removeEventListener('mousedown', handler)
        }
    })

    return( 
        props.trigger &&
        <div className={styles.popup}>
            <div ref={contentRef} className={styles.popupContent}>
                {props.children}
                <button onClick={props.onCloseButtonClicked} className={styles.closeButton}><IoCloseCircleOutline className={styles.closeIcon}/></button>
            </div>
        </div> 
    )
}