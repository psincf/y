import styles from "./styles.module.css"
import Image from "next/image"

import imageHome from "../public/Y.svg"

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

            <h2>Subscribe.</h2>
            <p>Create new account</p><br/>

            <p>You already have an account ?</p>
            <p>Connect</p>
        </div>
    )
}