import Link from "next/link"
import Image from "next/image"
import clsx from "clsx"

import styles from "./styles.module.css"
import logo from "@/public/y.svg"

export function Settings() {
    return(
        <div className={styles.settings}>
            <Link href="../">
            <Image
                src={logo}
                alt="Y"
                className={clsx(styles.logo, styles.button)}
            />
            </Link>
            <br/>
            <button type="button" className={styles.button}>{"\u2699"} Settings</button>
        </div>
    )
}