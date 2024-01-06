import Image from "next/image"
import Link from "next/link"

import clsx from "clsx"

import { TweetInterface, AccountInterface } from "@/db/db"
import { convertSVGtoJSX } from "@/utils/svg"

import styles from "./styles.module.css"
import { useContext, useState } from "react"
import { LocalAccountContext, dbContext } from "@/app/context"

export function Tweet({tweet, account, liked, retweeted, isRetweet }: { tweet: TweetInterface, account: AccountInterface, liked: Boolean, retweeted: Boolean, isRetweet?: string }) {
    let db = useContext(dbContext)
    let [likedState, setLikedState] = useState<Boolean>(liked)
    let [reTweetedState, setReTweetedState] = useState<Boolean>(retweeted)
    let [amountLike, setAmountLike] = useState<number>(tweet.likes.size)
    let [amountReTweet, setAmountReTweet] = useState<number>(tweet.retweet.size)
    let { localAccount } = useContext(LocalAccountContext)
    
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
    let media = <></>
    if (tweet.media) {
        let mediaJSX = convertSVGtoJSX(tweet.media!)
        media = <div className={styles.media}>{mediaJSX}</div>
    }

    let text = separateSpecialTextTweet(tweet.text)
    let textJSX = text.map((t) => {
        if (t.s[0] == "@") {
            let link = `../r/${t.s.substring(1)}`
            return(<Link href={link} key={t.key}>{t.s}</Link>)
        } else {
            return(<span key={t.key}>{t.s}</span>)
        }
    })

    const likeFn = () => {
        if (likedState) {
            db.removeLikeTweet(localAccount!.id, tweet.id)
            setAmountLike(amountLike - 1)
        } else {
            db.likeTweet(localAccount!.id, tweet.id)
            setAmountLike(amountLike + 1)
        }
        setLikedState(!likedState)
    }

    const retweetFn = () => {
        if (reTweetedState) {
            db.removeReTweet(localAccount!.id, tweet.id)
            setAmountReTweet(amountReTweet - 1)
        } else {
            db.reTweet(localAccount!.id, tweet.id)
            setAmountReTweet(amountReTweet + 1)
        }
        setReTweetedState(!reTweetedState)
    }

    return(
        <div className={styles.tweet}>
            <p className={styles.retweettext}>{isRetweet ? "\u{21BB} " + isRetweet.toString() +  " has retweeted": null}</p>
                <div className={styles.tweetinner}>
                <Link href={href}>
                    <div className={styles.accountphoto}>{photo}</div>
                </Link>
                <div className={styles.tweetcontent}>
                    <p className={styles.accountdetail}><span className={styles.accountname}>{account.name}</span> <span className={styles.grey}>@{account.account} {"\u{00B7}"} {time_string}</span></p>
                    <p className={styles.tweettext}>{textJSX}</p>
                    {media}
                    <div className={styles.tweetinfo}>
                        <div className={styles.tweetinteraction}><div className={styles.icon}>{"\u{1f4AC}"}</div> {tweet.comments.length}</div>
                        <div className={clsx(styles.tweetinteraction, styles.retweetbtn, reTweetedState && styles.retweeted)}  onClick={retweetFn}><div className={styles.icon}>{"\u{21BB}"}</div> {amountReTweet}</div>
                        <div className={clsx(styles.tweetinteraction, styles.likebtn, likedState && styles.liked)} onClick={likeFn}><div className={styles.icon}>{"\u{2661}"}</div> {amountLike}</div>
                        <div className={styles.tweetinteraction}><div className={styles.icon}>{"\u{21A5}"}</div></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function separateSpecialTextTweet(text: string): Array<{s: string, key: number}> {
    var stringArray = []
    var index = 0
    var key = 0
    while (true) {
        if (text.indexOf("@", index) != -1) {
            var new_index = text.indexOf("@", index)
            stringArray.push({ s: text.substring(index, new_index), key: key })
            key += 1

            var indexNextStop = nextNonAccountCharacter(text, new_index + 1)
            stringArray.push( {s: text.substring(new_index, indexNextStop), key: key })
            key += 1

            index = indexNextStop

            continue
        }
        if (index < text.length) {
            stringArray.push({s: text.substring(index), key: key })
        }
        return stringArray
    }
}

function nextNonAccountCharacter(text: string, position: number): number {
    var index = text.length
    const nonAccountCharacters = [" ", ",", ".", "@"]
    for (const c of nonAccountCharacters) {
        var temp_index = text.indexOf(c, position)
        if (temp_index != -1) { index = Math.min(index, temp_index) }
    }

    return index
}