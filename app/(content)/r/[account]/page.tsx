"use client"

import styles from "./styles.module.css"

import { AccountInterface } from "@/db/db"

import { Feed } from "./feed"
import { useEffect, useState, useContext } from "react"
import { dbContext } from "@/app/context"

enum ConnectionStatus {
    Connecting,
    NoAccount,
    Ok
}

export default function Page({ params }: { params: { account: string } }) {
    let [account, setAccount] = useState<null | AccountInterface>(null)
    let [info, setInfo] = useState(ConnectionStatus.Connecting);
    let db = useContext(dbContext)
    let feed;

    useEffect(() => {
        (async() => {
            if (info == ConnectionStatus.Connecting) {
                db.accounts.where("account").equals(params.account).first().then((acc) => {
                    if (acc == undefined) {
                        setInfo(ConnectionStatus.NoAccount)
                    } else {
                        setInfo(ConnectionStatus.Ok)
                        setAccount(acc!)
                        document.title = `${acc.name} @${acc.account}`
                    }
                })
            }
        })()
    })

    if (info == ConnectionStatus.Connecting) {
        feed = <div className={styles.feed}>Loading...</div>
    }
    else if (info == ConnectionStatus.NoAccount) {
        feed = <div className={styles.feed}>Do not exist</div>
    }
    else {
        feed = <Feed account={account!}></Feed>
    }
    return(
        <>
            {feed}
        </>
    )
}