import styles from './ErrorPage.module.css'

export default function ErrorPage(props){
    return(
        <div className={styles.Container}>
            <h1 className={styles.h1}>{props.children}</h1>
        </div>
    )
}