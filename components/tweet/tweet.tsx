import Image from "next/image"
import Link from "next/link"

import { TweetInterface, AccountInterface } from "@/db/db"
import { convertSVGtoJSX } from "@/utils/svg"

import styles from "./styles.module.css"

export function Tweet({tweet, account }: { tweet: TweetInterface, account: AccountInterface }) {
    let href = `/r/${account.account}`
    let time_elpased = Math.floor((Date.now() - tweet.date.valueOf()) / 1_000)
    let time_string;
    if (time_elpased < 60) {
        time_string = time_elpased.toString() + "s"
    } else if (time_elpased < 3600) {
        time_string = Math.floor(time_elpased / 60).toString() + "m"
    } else if (time_elpased < 86400) {
        time_string = Math.floor(time_elpased / 3600).toString() + "h"
    } else {
        time_string = tweet.date.toLocaleString("en-US", {day: "2-digit"}) + " " +
                    tweet.date.toLocaleString("en-US", {month: "short", year: "numeric"})
    }

    let photo = convertSVGtoJSX(account.photo)
    return(
        <div className={styles.tweet}>
            <Link href={href}>
                <div className={styles.accountphoto}>{photo}</div>
            </Link>
            <div className={styles.tweetcontent}>
                <p>{account.name} <span className={styles.grey}>@{account.account} {"\u{00B7}"} {time_string}</span></p>
                <br/>
                <p>{tweet.text}</p>
                <div className={styles.tweetinfo}>
                    <p>{"\u{1f4AC}"} {tweet.comments.length}</p>
                    <p>{"\u{21BB}"} {tweet.retweet.length}</p>
                    <p>{"\u{2661}"} {tweet.likes.size}</p>
                </div>
            </div>
        </div>
    )
}