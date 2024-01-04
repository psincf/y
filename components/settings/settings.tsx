"use client"

import Link from "next/link"
import Image from "next/image"
import clsx from "clsx"

import styles from "./styles.module.css"
import logo from "@/public/y.svg"
import { dbContext, DbLoadedContext, LocalAccountContext } from "@/app/context"
import { useContext } from "react"
import { useRouter } from "next/navigation"

export function Settings() {
    const db = useContext(dbContext)
    const dbLoaded = useContext(DbLoadedContext)
    const { localAccount } = useContext(LocalAccountContext)
    const router = useRouter()
    const resetDb = () => {
        (async() => {
            router.push("/")
            await db.clear()
            dbLoaded.setDb(false)
        })()
    }
    const hrefProfile = `/r/${localAccount?.account}`
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
            <Link href="/feed">
                <button type="button" className={styles.button}>
                    <i className={clsx("fi fi-rr-home", styles.icon)}></i>
                    <span className={styles.settingsname}> Home</span>
                </button>
            </Link>
            <br/>
            <button type="button" className={styles.button}>
                <i className={clsx("fi fi-rr-bell", styles.icon)}></i>
                <span className={styles.settingsname}> Notifications</span>
            </button>
            <br/>
            <button type="button" className={styles.button}>
                <i className={clsx("fi fi-rr-envelope", styles.icon)}></i>
                <span className={styles.settingsname}> Messages</span>
            </button>
            <br/>
            <Link href={hrefProfile}>
                <button type="button" className={styles.button}>
                    <i className={clsx("fi fi-rr-user", styles.icon)}></i>
                    <span className={styles.settingsname}> Profile</span>
                </button>
            </Link>
            <br/>
            <button type="button" className={styles.button}>
                <i className={clsx("fi fi-rr-settings", styles.icon)}></i>
                <span className={styles.settingsname}> Settings</span>
            </button>
            <br/>
            <button type="button" className={styles.button} onClick={resetDb}>
                <i className={clsx("fi fi-rr-layers", styles.icon)}></i>
                <span className={styles.settingsname}> Reset database</span>
            </button>
        </div>
    )
}