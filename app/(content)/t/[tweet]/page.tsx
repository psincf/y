"use client"

import styles from "./styles.module.css"

import { AccountInterface, TweetInterface } from "@/db/db"

import { useEffect, useState, useContext } from "react"
import { dbContext } from "@/app/context"
import { Tweet } from "@/components/tweet/tweet"

interface TweetInfo {
    tweet: TweetInterface
    account: AccountInterface
    liked: Boolean,
    retweeted: Boolean
}

export default function Page({ params }: { params: { tweet: string } }) {
    let [tweetInfo, setTweetInfo] = useState<null | TweetInfo>(null)
    let db = useContext(dbContext)
    let content = <></>;

    useEffect(() => {
        (async() => {
            let localAccount = (await db.getAccount(0))!
            let tweetId = Number.parseInt(params.tweet)
            let tweet = (await db.getTweet(tweetId))!
            let account = (await db.getAccount(tweet.account))!

            let liked = localAccount.likes.has(tweetId)
            let retweeted = localAccount.retweets.some((r) => r.id == tweet.id)

            setTweetInfo({
                tweet: tweet,
                account: account,
                liked: liked,
                retweeted: retweeted
            })
        })()
    })

    if (tweetInfo != null) {
        content = <Tweet
            tweet={tweetInfo!.tweet}
            account={tweetInfo!.account}
            liked={tweetInfo!.liked}
            retweeted={tweetInfo!.retweeted}
        ></Tweet>
    }
    
    return(
        <>
            <div className={styles.tweet}>
                {content}
            </div>
        </>
    )
}