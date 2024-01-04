"use client"

import { useContext, useEffect, useState } from "react"
import { dbContext, DbLoadedContext, LocalAccountContext } from "@/app/context"
import { AccountInterface } from "@/db/db"

export default function RootLayout({ children } : { children: React.ReactNode }) {
    let [dbLoaded, setDbLoaded] = useState(false)
    let [localAccount, setLocalAccount] = useState<AccountInterface | undefined>(undefined)
    let db = useContext(dbContext)

    useEffect(() => {
        (async() => {
            await db.init()
            let loc = (await db.getAccount(0))!
            setLocalAccount(loc)
            setDbLoaded(true)
        })()
    }, [db])

    var inner: React.ReactNode = <></>
    if (dbLoaded) {
        inner = children
    }
    return(
        <DbLoadedContext.Provider value={ {db: dbLoaded, setDb: setDbLoaded} }>
            <LocalAccountContext.Provider value={ {localAccount: localAccount, setLocalAccount: setLocalAccount} }>
            { inner }
            </LocalAccountContext.Provider>
        </DbLoadedContext.Provider>
    )
}