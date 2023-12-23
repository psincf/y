import { AccountInterface, TweetInterface } from "@/db/db"
import { convertSVGtoJSX } from "@/utils/svg"
import Link from "next/link"
import clsx from "clsx"

import styles from "./styles.module.css"

import { dbContext } from "@/app/context"
import { useEffect, useState, useContext } from "react"
import { Tweet } from "@/components/tweet/tweet"

enum ContentKind {
    Tweet,
    TweetReplies,
    Likes
}

export function Feed({ account }: { account: AccountInterface }) {

    return(
        <div className={styles.feed}>
            <div className={styles.topfeed}>
                <div>
                    <Link href="../feed" className={clsx(styles.button, styles.smallbutton)}>{"\u{1F850}"}</Link>
                </div>
                <p>{account.account}</p>
            </div>
            <HeaderAndPhoto account={account}></HeaderAndPhoto>
            <AccoutInfo account={account}></AccoutInfo>
            <FeedContent account={account}></FeedContent>
        </div>
    )
}

function HeaderAndPhoto({ account }: { account: AccountInterface } ) {
    return(
        <div className={styles.headerandphoto}>
            <Header account={account}></Header>
            <Photo account={account}></Photo>
        </div>
    )
}

function Header({ account }: { account: AccountInterface } ) {
    let header = convertSVGtoJSX(account.header)

    return(
        <div className={styles.header}>{header}</div>
    )
}

function Photo({ account }: { account: AccountInterface } ) {
    let photo = convertSVGtoJSX(account.photo)

    return(
        <div className={styles.photo}>{photo}</div>
    )
}

function AccoutInfo({ account }: { account: AccountInterface } ) {
    return(
        <div className={styles.accountinfo}>
            <p>{account.name}</p>
            <p className={styles.grey}>@{account.account}</p>
            <br/>
            <p>{account.headline}</p>
            <br/>
            <p className={styles.grey}>{"\u{1f4c5}"}Joined {account.dateCreation.toLocaleString("en-US", {month: "long", year: "numeric"})}</p>
            <br/>
            <p>{account.following.size} <span className={styles.grey}>following</span> {account.followers} <span className={styles.grey}>followers</span></p>
        </div>
    )
}

function FeedContent({ account }: { account: AccountInterface } ) {
    const [contentKind, setContentKind] = useState(ContentKind.Tweet)
    
    return(
        <>
            <div className={styles.wrapbuttonfeedcontent}>
                <div className={styles.buttonfeedcontent} onClick={() => { setContentKind(ContentKind.Tweet) }}>Tweets</div>
                <div className={styles.buttonfeedcontent} onClick={() => { setContentKind(ContentKind.TweetReplies) }}>Tweets & replies</div>
                <div className={styles.buttonfeedcontent} onClick={() => { setContentKind(ContentKind.Likes) }}>Likes</div>
            </div>
            <Tweets account={account} kind={contentKind}></Tweets>
        </>
    )
}

interface TweetAndAccount {
    tweet: TweetInterface,
    account: AccountInterface
}

function Tweets({ account, kind }: { account: AccountInterface, kind: ContentKind } ) {
    let [tweets, setTweets] = useState<Array<TweetAndAccount>>([]);
    let db = useContext(dbContext)

    useEffect(() => {
        if (kind == ContentKind.Tweet || kind == ContentKind.TweetReplies) {
            let tempTweets: Array<TweetAndAccount> = []
            db.tweets.bulkGet(account.tweets).then((tweetsQuery) => {
                for (let t of tweetsQuery) {
                    tempTweets.push({tweet: t!, account: account})
                }
                setTweets(tempTweets)
            })
        } else if (kind == ContentKind.Likes) {
            let tempTweetsJSX: Array<TweetAndAccount> = []
            let tweets_id = Array.from(account.likes);
            (async () => {
                let tempTweets = await db.tweets.bulkGet(tweets_id)
                let tempAccountsId = []
                for (const t of tempTweets) {
                    tempAccountsId.push(t!.account)
                }
                let tempAccounts = await db.accounts.bulkGet(tempAccountsId)

                for (var i = 0; i < tempTweets.length; i += 1) {
                    let t = tempTweets[i]
                    let acc = tempAccounts[i]!
                    tempTweetsJSX.push({tweet: t!, account: acc})
                }
                setTweets(tempTweetsJSX)
            })();
            
        }
    }, [db, account, kind])

    let tweetsJSX = tweets.map((t) => {
        return(
            <Tweet account={t.account} tweet={t.tweet} key={t.tweet.id}></Tweet>
        )
    })

    return(
        <>
            {tweetsJSX}
        </>
    )
}