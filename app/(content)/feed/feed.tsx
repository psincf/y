import { AccountInterface, TweetInterface } from "@/db/db"

import styles from "./styles.module.css"

import { useState, useEffect, useContext } from "react"

import { dbContext } from "@/app/context"
import { Tweet } from "@/components/tweet/tweet"
import { NewTweet } from "@/components/newtweet/newtweet"

export function Feed({ account }: { account?: AccountInterface }) {
    return(
        <div className={styles.feed}>
            { account ?
            <>
                <TopFeed></TopFeed>
                <FeedContent account={account}></FeedContent>
            </>
                : null }
        </div>
    )
}

function TopFeed() {
    return (
        <div className={styles.topfeed}>
            <div className={styles.topfeedhome}>
                <p>Home</p>
            </div>
            <NewTweet></NewTweet>
        </div>
    )
}

function FeedContent({ account }: { account: AccountInterface } ) {
    return(
        <>
            <Tweets account={account}></Tweets>
        </>
    )
}

function Tweets({ account }: { account: AccountInterface } ) {
    interface TweetAccount {
        tweet: TweetInterface,
        account: AccountInterface,
        liked: Boolean,
        retweeted: Boolean
    }
    let [tweetsAndAccount, setTweetsAndAccount] = useState<Array<TweetAccount>>([])
    let db = useContext(dbContext)

    useEffect(() => {
        let fn = async() => {
            let local_account = (await db.getAccount(0))!
            let tweetsCount = await db.getTweetCount()
            let TweetAccountsTemp = []
            let tweetsIdTemp = []
            let accountsIdTemp = []
            let likedTemp = []
            let retweetedTemp = []
            for (let i = 0; i < 50; i += 1) {
                let id = tweetsCount - 1 - i
                tweetsIdTemp.push(id)
            }
            let tweetsTemp = await db.bulkGetTweet(tweetsIdTemp)
            for (const t of tweetsTemp) {
                accountsIdTemp.push(t!.account)
                likedTemp.push(local_account.likes.has(t!.id))
                retweetedTemp.push(local_account.retweets.some(r => r.id == t?.id))
            }

            let accountsTemp = await db.bulkGetAccount(accountsIdTemp)

            for (var i = 0; i < tweetsTemp.length; i += 1) {
                TweetAccountsTemp.push(
                    {tweet: tweetsTemp[i]!, account: accountsTemp[i]!, liked: likedTemp[i], retweeted: retweetedTemp[i]}
                )
            }

            setTweetsAndAccount(TweetAccountsTemp)
        }
        fn()
    }, [db])

    let tweetsJSX = []

    let i = 0
    for (let t of tweetsAndAccount) {
        if (t.tweet.isReply) { continue }
        i += 1
        tweetsJSX.push(
            <Tweet account={t.account} tweet={t.tweet} liked={t.liked} retweeted={t.retweeted} key={i}></Tweet>
        )
    }

    return(
        <>
            {tweetsJSX}
        </>
    )
}