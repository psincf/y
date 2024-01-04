"use client"
import "@/app/overflowy.css"

import styles from "./styles.module.css"

import { Settings } from "@/components/settings/settings"
import { Aside } from "@/components/aside/aside"
import { Feed } from "./feed"
import { LocalAccountContext } from "@/app/context"
import { useContext } from "react"

export default function Page() {
    let { localAccount } = useContext(LocalAccountContext)

    return(
        <>
            <div className={styles.page}>
                <Settings></Settings>
                <Feed account={localAccount}></Feed>
                <Aside></Aside>
            </div>
        </>
    )
}