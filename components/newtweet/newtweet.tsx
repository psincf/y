import { useContext, useRef } from "react"
import styles from "./styles.module.css"
import { LocalAccountContext, dbContext } from "@/app/context"
import { convertSVGtoJSX } from "@/utils/svg"
import Image from "next/image"

export function NewTweet({isReply} : {isReply?: number}) {
    let { localAccount } = useContext(LocalAccountContext)
    let db = useContext(dbContext)
    let photo = convertSVGtoJSX(localAccount?.photo!)

    let textAreaRef = useRef<HTMLTextAreaElement>(null)
    let adaptHeight = () => {
        textAreaRef.current!.style.height = "0"
        textAreaRef.current!.style.height = Math.max(textAreaRef.current!.scrollHeight, 40) + "px"
    }

    let tweetFn = async() => {
        await db.addTweet(localAccount!.id, textAreaRef.current!.value!, undefined, isReply)
        textAreaRef.current!.value! = ""
        window.location.reload()
    }

    return (
        <div className={styles.newtweet}>
            <div className={styles.photoaccount}>
                {photo}
            </div>
            <div className={styles.tweetcontent}>
                <textarea ref={textAreaRef} name="tweet" maxLength={256} placeholder="What's happening" onChange={adaptHeight}>

                </textarea>
                <div className={styles.bottom}>
                    <div className={styles.bottommedia}>
                        <i className="fi fi-rr-picture"></i>
                    </div>
                    <div className={styles.tweetbutton} onClick={tweetFn}>
                        Tweet
                    </div>
                </div>
            </div>
        </div>
    )
}