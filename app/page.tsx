import styles from "./styles.module.css"
import Image from "next/image"

import imageHome from "../public/y.svg"

import clsx from "clsx"

export default function Page() {
    return(
        <>
            <header className={styles.topheader}>
            </header>
            <div className={styles.page}>
                <Logo></Logo>
                <Login></Login>
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
            <button className={clsx(styles.specialbutton, styles.signupbutton)}>Sign up with mail</button><br/>

            <p>You already have an account ?</p>
            <button className={clsx(styles.specialbutton, styles.loginbutton)}>Login</button>
        </div>
    )
}