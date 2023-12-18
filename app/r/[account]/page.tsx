import styles from "./styles.module.css"
import Link from "next/link"

import { Metadata, ResolvingMetadata, GetStaticProps } from "next"

export async function generateMetadata(
    { params, searchParams }: any,
    parent: ResolvingMetadata
) : Promise<Metadata> {
    const account = params.account

    return {
        title: `Account @${account}`
    }
}

export default function Page() {
    return(
        <>
            <header className={styles.topheader}>
                <Link href="../"><h1>Y</h1></Link>
            </header>
            <div className={styles.page}>
                <Settings></Settings>
                <Feed></Feed>
                <Aside></Aside>
            </div>
        </>
    )
}

function Settings() {
    return(
        <div className={styles.settings}>
            <p>Settings</p>
        </div>
    )
}

function Feed() {
    return(
        <div className={styles.feed}>
            <Link href="../">{"\u2190"}</Link>
        </div>
    )
}

function Aside() {
    return(
        <div className={styles.aside}>
            <p>Aside</p>
        </div>
    )
}