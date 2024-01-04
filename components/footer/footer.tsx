import Link from "next/link"
import styles from "./styles.module.css"

export function Footer() {
    return(
        <div className={styles.footer}>
            <Link href="../licenses" target="_blank">licenses</Link>
            <Link href="https://www.github.com/psincf/y" target="_blank">github</Link>
            <p>UIcons by <a href="https://www.flaticon.com/uicons">Flaticon</a></p>
        </div>

    )
}