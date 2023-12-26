import styles from "./styles.module.css"

export function Loading() {
    return(
        <div className={styles.cont}>
            <div className={styles.loading}>{"\u{21BA}"}
            </div>
        </div>
    )
}