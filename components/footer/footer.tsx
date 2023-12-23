import Link from "next/link"
import styles from "./styles.module.css"

export function Footer() {
    return(
        <div className={styles.footer}>
            <Link href="../licenses">licenses</Link>
            <Link href="https://www.github.com/psincf/y">github</Link>
        </div>

    )
}