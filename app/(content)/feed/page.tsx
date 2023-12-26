"use client"
import "@/app/overflowy.css"

import styles from "./styles.module.css"

import { AccountInterface } from "@/db/db"

import { Settings } from "@/components/settings/settings"
import { Aside } from "@/components/aside/aside"
import { Feed } from "./feed"
import { useEffect, useState, useContext } from "react"
import { dbContext } from "@/app/context"

import { Loading } from "@/components/loading/loading"

export default function Page() {
    let [localAccount, setLocalAccount] = useState<null | AccountInterface>(null)

    let db = useContext(dbContext)
    let feed

    useEffect(() => {
        document.title = "Y social network";
        (async() => {
            let acc = await db.accounts.get(0)
            setLocalAccount(acc!)
        })()
        
    }, [db])

    if (localAccount == null) {
        feed = <Loading></Loading>
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