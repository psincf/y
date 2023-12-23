"use client"

import Link from "next/link"

import styles from "./styles.module.css"
import Image from "next/image"
import imageHome from "../public/y.svg"

import clsx from "clsx"
import { Footer } from "@/components/footer/footer"


export default function Page() {
    return(
        <>
            <div className={styles.page}>
                <div className={styles.pagecontent}>
                    <Logo></Logo>
                    <Login></Login>
                </div>
                <Footer></Footer>
            </div>
        </>
    )
}

function Logo() {
    return(
        <div className={styles.logo}>
            <Image
                src={imageHome}
                alt="Y"
                
                className={styles.imagelogo}
            />
        </div>
    )
}

function Login() {
    return(
        <div className={styles.login}>
            <h2>Y not ?</h2><br/>

            <h3>Sign up.</h3>
            <div className={clsx(styles.specialbutton, styles.signupbutton)}>Sign up</div><br/>

            <p>You already have an account ?</p>
            <div className={clsx(styles.specialbutton, styles.loginbutton)}>Login</div>
            <Link href="./feed" className={styles.specialbutton}>
                Browse feed
            </Link>
        </div>
    )
}