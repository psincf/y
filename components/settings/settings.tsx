"use client"

import Link from "next/link"
import Image from "next/image"
import clsx from "clsx"

import styles from "./styles.module.css"
import logo from "@/public/y.svg"
import { dbContext, DbLoadedContext } from "@/app/context"
import { useContext } from "react"
import { useRouter } from "next/navigation"

export function Settings() {
    const db = useContext(dbContext)
    const dbLoaded = useContext(DbLoadedContext)
    const router = useRouter()
    const resetDb = () => {
        (async() => {
            await db.clear()
            await db.init()
            dbLoaded.setDb(false)
        })()
    }
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
            <br/>
            <button type="button" className={styles.button} onClick={resetDb}>{"\u26C3"} Reset database</button>
        </div>
    )
}