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
    let [repliesBefore, setRepliesBefore] = useState<Array<TweetInfo>>([])
    let [repliesAfter, setRepliesAfter] = useState<Array<TweetInfo>>([])
    let db = useContext(dbContext)
    let content = [];

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

            let repliesTweetBefore = (await db.getTweetsReplied(tweetId))!
            repliesTweetBefore.reverse()
            let repliesBeforeTemp = []
            for (const t of repliesTweetBefore) {
                let accountTweet = (await db.getAccount(t.account))!
                repliesBeforeTemp.push({
                    tweet: t,
                    account: accountTweet,
                    liked: account.likes.has(t.id),
                    retweeted: account.retweets.some((r) => r.id == t.id)
                })
            }
            setRepliesBefore(repliesBeforeTemp)

            let repliesTweetAfter = (await db.bulkGetTweet(tweet.replies))!
            let repliesAfterTemp = []
            for (const t of repliesTweetAfter) {
                let accountTweet = (await db.getAccount(t!.account))!
                repliesAfterTemp.push({
                    tweet: t!,
                    account: accountTweet,
                    liked: account.likes.has(t!.id),
                    retweeted: account.retweets.some((r) => r.id == t!.id)
                })
            }
            setRepliesAfter(repliesAfterTemp)
        })()
    }, [db, params])

    if (tweetInfo != null) {
        for (const t of repliesBefore) {
            content.push(<Tweet
                tweet={t.tweet}
                account={t.account}
                liked={t.liked}
                retweeted={t.retweeted}
                nextIsReply={true}
                key={t.tweet.id}
            ></Tweet>)
        }
        content.push(<Tweet
            tweet={tweetInfo!.tweet}
            account={tweetInfo!.account}
            liked={tweetInfo!.liked}
            retweeted={tweetInfo!.retweeted}
            mainTweet={true}
            key={tweetInfo.tweet.id}
        ></Tweet>)
        for (const t of repliesAfter) {
            content.push(<Tweet
                tweet={t.tweet}
                account={t.account}
                liked={t.liked}
                retweeted={t.retweeted}
                key={t.tweet.id}
            ></Tweet>)
        }

    }
    
    return(
        <>
            <div className={styles.tweet}>
                {content}
            </div>
        </>
    )
}