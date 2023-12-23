"use client"

import styles from "./styles.module.css"

import { AccountInterface } from "@/db/db"

import { Settings } from "@/components/settings/settings"
import { Aside } from "@/components/aside/aside"
import { Feed } from "./feed"
import { useEffect, useState, useContext } from "react"
import { dbContext } from "../context"

export default function Page() {
    let [localAccount, setLocalAccount] = useState<null | AccountInterface>(null)

    let db = useContext(dbContext)
    let feed

    useEffect(() => {
        (async() => {
            await db.init()
            db.accounts.get(0).then((acc) => {
                setLocalAccount(acc!)
            })
        })()
        
    }, [db])

    if (localAccount == null) {
        feed = <div className={styles.feed}>Loading...</div>
    } else {
        feed = <Feed account={localAccount}></Feed>
    }

    return(
        <>
            <div className={styles.page}>
                <Settings></Settings>
                {feed}
                <Aside></Aside>
            </div>
        </>
    )
}