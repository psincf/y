"use client"

import { useContext, useEffect, useState } from "react"
import { dbContext, DbLoadedContext } from "@/app/context"

export default function RootLayout({ children } : { children: React.ReactNode }) {
    let [dbLoaded, setDbLoaded] = useState(false)
    let db = useContext(dbContext)

    useEffect(() => {
        (async() => {
            await db.init()
            setDbLoaded(true)
        })()
    })

    var inner: React.ReactNode = <></>
    if (dbLoaded) {
        inner = children
    }
    return(
        <DbLoadedContext.Provider value={ {db: dbLoaded, setDb: setDbLoaded} }>
            { inner }
        </DbLoadedContext.Provider>
    )
}