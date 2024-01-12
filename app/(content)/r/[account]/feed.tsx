import { AccountInterface, TweetInterface } from "@/db/db"
import { convertSVGtoJSX } from "@/utils/svg"
import Link from "next/link"
import clsx from "clsx"

import styles from "./styles.module.css"

import { dbContext } from "@/app/context"
import { useEffect, useRef, useState, useContext } from "react"
import { Tweet } from "@/components/tweet/tweet"
import { Loading } from "@/components/loading/loading"
import { useRouter } from "next/navigation"

enum ContentKind {
    Tweet,
    TweetReplies,
    Likes
}

export function Feed({ account }: { account?: AccountInterface }) {
    let rooter = useRouter()
    return(
        <div className={styles.feed}>
            <div className={styles.topfeed}>
                <div className={styles.backbuttonwrapper} onClick={() => { rooter.back() }}>
                    <div className={styles.backbutton}>{"\u{1F850}"}</div>
                </div>
                {account ? <p>{account.account}</p> : null}
            </div>
            { 
                account ? 
                    <>
                        <HeaderAndPhoto account={account}></HeaderAndPhoto>
                        <AccoutInfo account={account}></AccoutInfo>
                        <FeedContent account={account}></FeedContent>
                    </> :
                        <Loading></Loading>
            }
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
            <p className={styles.accountname}>{account.name}</p>
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
                <div className={ clsx(styles.buttonfeedcontent, contentKind == ContentKind.Tweet && styles.active) } onClick={() => { setContentKind(ContentKind.Tweet) }}>Tweets</div>
                <div className={ clsx(styles.buttonfeedcontent, contentKind == ContentKind.TweetReplies && styles.active) } onClick={() => { setContentKind(ContentKind.TweetReplies) }}>Tweets & replies</div>
                <div className={ clsx(styles.buttonfeedcontent, contentKind == ContentKind.Likes && styles.active) } onClick={() => { setContentKind(ContentKind.Likes) }}>Likes</div>
            </div>
            <Tweets accountId={account.id} kind={contentKind}></Tweets>
        </>
    )
}

interface TweetAndAccount {
    isReply?: number,
    isRetweet?: string,
    dateRetweet?: Date,
    tweet: TweetInterface,
    account: AccountInterface,
    liked: Boolean,
    retweeted: Boolean
}

function Tweets({ accountId, kind }: { accountId: number, kind: ContentKind } ) {
    let [tweets, setTweets] = useState<Array<TweetAndAccount>>([]);
    let [tweetsReplied, setTweetsRplied] = useState<Map<number, TweetAndAccount>>(new Map());
    let prev_kind = useRef(ContentKind.Tweet)
    let db = useContext(dbContext)

    useEffect(() => {
        (async () => {
            let account = (await db.getAccount(accountId))!
            let local_account = (await db.getAccount(0))!
            if (kind == ContentKind.Tweet) {
                let tempTweets: Array<TweetAndAccount> = []
                let tweetsQuery = await db.bulkGetTweet(account.tweets)
                let reTweetsQuery = await db.bulkGetTweet(account.retweets.map(r => r.id))
                for (let t of tweetsQuery) {
                    if (t?.isReply) { continue }
                    tempTweets.push({
                        tweet: t!,
                        account: account,
                        liked: local_account.likes.has(t!.id),
                        retweeted: local_account.retweets.some(r => r.id == t?.id)
                    })
                }
                for (let i in reTweetsQuery) {
                    const t = reTweetsQuery[i]
                    const t_date = account.retweets[i].date
                    let accountTweet = (await db.getAccount(t!.account))!
                    tempTweets.push({
                        isRetweet: account.account,
                        dateRetweet: t_date,
                        tweet: t!,
                        account: accountTweet,
                        liked: local_account.likes.has(t!.id),
                        retweeted: local_account.retweets.some(r => r.id == t?.id)
                    })
                }
                tempTweets.sort((a, b) => {
                    return (a.dateRetweet ? a.dateRetweet : a.tweet.date) < (b.dateRetweet ? b.dateRetweet : b.tweet.date) ? 1 : -1
                })
                prev_kind.current = kind
                setTweets(tempTweets)
            } else if (kind == ContentKind.TweetReplies) {
                let tempTweetsReplied: Map<number, TweetAndAccount> = new Map()
                let tempTweets: Array<TweetAndAccount> = []
                let tweetsQuery = await db.bulkGetTweet(account.tweets)
                for (let t of tweetsQuery) {
                    if (t?.isReply) {
                        let tempTweetReplied = (await db.getTweet(t.isReply))!
                        let accountTweet = (await db.getAccount(tempTweetReplied.account))!
                        tempTweetsReplied.set(t.isReply, {
                            tweet: tempTweetReplied,
                            account: accountTweet,
                            liked: local_account.likes.has(tempTweetReplied.id),
                            retweeted: local_account.retweets.some(r => r.id == tempTweetReplied.id)
                        })
                    }
                    tempTweets.push({
                        isReply: t?.isReply,
                        tweet: t!,
                        account: account,
                        liked: local_account.likes.has(t!.id),
                        retweeted: local_account.retweets.some(r => r.id == t?.id)
                    })
                }
                tempTweets.sort((a, b) => {
                    return (a.dateRetweet ? a.dateRetweet : a.tweet.date) < (b.dateRetweet ? b.dateRetweet : b.tweet.date) ? 1 : -1
                })
                prev_kind.current = kind
                setTweets(tempTweets)
                setTweetsRplied(tempTweetsReplied)
                
            } else if (kind == ContentKind.Likes) {
                let tempTweetsJSX: Array<TweetAndAccount> = []
                let tweets_id = Array.from(account.likes);
                let tempTweets = await db.bulkGetTweet(tweets_id)
                let tempAccountsId = []
                for (const t of tempTweets) {
                    tempAccountsId.push(t!.account)
                }
                let tempAccounts = await db.bulkGetAccount(tempAccountsId)

                for (var i = 0; i < tempTweets.length; i += 1) {
                    let t = tempTweets[i]
                    let acc = tempAccounts[i]!
                    tempTweetsJSX.push({
                        tweet: t!,
                        account: acc,
                        liked: local_account.likes.has(t!.id),
                        retweeted: local_account.retweets.some(r => r.id == t?.id)})
                }
                prev_kind.current = kind
                tempTweetsJSX.reverse()
                setTweets(tempTweetsJSX)
            }
        })()
    }, [db, accountId, kind])

    let tweetsJSX
    if (kind != prev_kind.current) {
        tweetsJSX = <Loading></Loading>
    } else {
        let i = 0
        tweetsJSX = tweets.map((t) => {
            if (kind == ContentKind.TweetReplies && t.isReply) {
                let tweetReplied = tweetsReplied.get(t.isReply)!
                let toReturn =
                    <div key={i}>
                        <Tweet account={tweetReplied.account} tweet={tweetReplied.tweet} liked={tweetReplied.liked} retweeted={tweetReplied.retweeted} isRetweet={tweetReplied.isRetweet} nextIsReply={true}></Tweet>
                        <Tweet account={t.account} tweet={t.tweet} liked={t.liked} retweeted={t.retweeted} isRetweet={t.isRetweet}></Tweet>
                    </div>
                i += 1
                return toReturn
            }
            i += 1
            return(
                <Tweet account={t.account} tweet={t.tweet} liked={t.liked} retweeted={t.retweeted} isRetweet={t.isRetweet} key={i - 1}></Tweet>
            )
        })
    }

    return(
        <>
            {tweetsJSX}
        </>
    )
}