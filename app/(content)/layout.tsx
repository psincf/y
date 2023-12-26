"use client"

import { useContext, useEffect, useState } from "react"
import { dbContext } from "@/app/context"

export default function RootLayout({ children } : { children: React.ReactNode }) {
    let [dbLoaded, setdbLoaded] = useState(false)
    let db = useContext(dbContext)

    useEffect(() => {
        (async() => {
            await db.init()
            setdbLoaded(true)
        })()
    })

    var inner: React.ReactNode = <></>
    if (dbLoaded) {
        inner = children
    }
    return(
        <>
            { inner }
        </>
    )
}