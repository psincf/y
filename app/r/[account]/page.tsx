import styles from "./styles.module.css"
import Link from "next/link"

import Image from "next/image"

import logo from "../../../public/y.svg"

import { Metadata, ResolvingMetadata, GetStaticProps } from "next"
import clsx from "clsx"

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
            <Link href="../">
            <Image
                src={logo}
                alt="Y"
                className={clsx(styles.logo, styles.button)}
            />
            </Link>
            <br/>
            <button type="button" className={styles.button}>{"\u2699"} Settings</button>
        </div>
    )
}

function Feed() {
    return(
        <div className={styles.feed}>
            <div className={styles.topfeed}>
                <Link href="../" className={clsx(styles.button, styles.smallbutton)}>{"\u2190"}</Link>
            </div>
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