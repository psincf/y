"use client"

import Link from "next/link"

import { useEffect, useState, useContext } from "react"
import { dbContext } from "@/app/context"

import styles from "./aside.module.css"
import { AccountInterface } from "@/db/db"
import { convertSVGtoJSX } from "@/utils/svg"
import { Footer } from "../footer/footer"

export function Aside() {
    return(
        <div className={styles.aside}>
            <AccountProposition></AccountProposition>
            <Footer></Footer>
        </div>
    )
}

function AccountProposition() {
    let [accounts, setAccounts] = useState<Array<AccountInterface>>([])
    let db = useContext(dbContext)
    
    useEffect(() => {
        let fn = async () => {
            let count = await db.getAccountCount()
            if (count == 0) { setTimeout(fn, 500); return }
            let accountsTemp = []
            for (let i = 0; i < 3; i += 1) {
                let id = Math.floor(Math.random() * count);
                let account = (await db.getAccount(id))!
                if (account == undefined) { setTimeout(fn, 500); return }
                accountsTemp.push(account)
            }
            setAccounts(accountsTemp)
        }
        fn()
    }, [db])

    let accountsProposed = []

    let i = 0
    for (let acc of accounts) {
        i += 1
        accountsProposed.push(
            <Account account={acc} key={i}></Account>
        )
    }

    return(
        <div className={styles.accountpropositioncontainer}>
            <p>You might like</p>
            {accountsProposed}
        </div>
    )
}

function Account( {account}: {account: AccountInterface} ) {
    let href = `/r/${account.account}`
    let photo = convertSVGtoJSX(account.photo)
    return(
        <>
            <Link href={href} className={styles.accountproposed}>
                {photo}
                <div>
                    <div className={styles.accountname}>{account.name}</div>
                    <div className={styles.grey}>@{account.account}</div>
                </div>
            </Link>
        </>
    )
}