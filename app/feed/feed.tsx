import { AccountInterface, TweetInterface } from "@/db/db"

import styles from "./styles.module.css"

import { useState, useEffect, useContext } from "react"

import { dbContext } from "../context"
import { Tweet } from "@/components/tweet/tweet"

export function Feed({ account }: { account: AccountInterface }) {

    return(
        <div className={styles.feed}>
            <FeedContent account={account}></FeedContent>
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
        account: AccountInterface
    }
    let [tweetsAndAccount, setTweetsAndAccount] = useState<Array<TweetAccount>>([])
    let db = useContext(dbContext)

    useEffect(() => {
        if (tweetsAndAccount.length > 0) {
            return
        }
        let fn = async() => {
            let tweetsCount = await db.tweets.count()
            let TweetAccountsTemp = []
            let tweetsIdTemp = []
            let accountsIdTemp = []
            for (let i = 0; i < 100; i += 1) {
                let id = Math.floor(Math.random() * tweetsCount)
                tweetsIdTemp.push(id)
            }
            let tweetsTemp = await db.tweets.bulkGet(tweetsIdTemp)
            for (const t of tweetsTemp) {
                accountsIdTemp.push(t!.account)
            }

            let accountsTemp = await db.accounts.bulkGet(accountsIdTemp)

            for (var i = 0; i < tweetsTemp.length; i += 1) {
                TweetAccountsTemp.push(
                    {tweet: tweetsTemp[i]!, account: accountsTemp[i]!}
                )
            }

            setTweetsAndAccount(TweetAccountsTemp)
        }
        fn()
    })

    let tweetsJSX = []

    let i = 0
    for (let t of tweetsAndAccount) {
        i += 1
        tweetsJSX.push(
            <Tweet account={t.account} tweet={t.tweet} key={i}></Tweet>
        )
    }

    return(
        <>
            {tweetsJSX}
        </>
    )
}