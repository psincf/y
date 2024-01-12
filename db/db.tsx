import Dexie, { Table } from "dexie"
import { SeedCreator } from "./seed"

export interface TweetInterface {
    id: number
    account: number
    text: string
    media?: SVGInterface,
    date: Date
    isReply?: number,
    replies: Array<number>
    retweet: Set<number>
    likes: Set<number>
}

export interface RetweetInterface {
    id: number,
    date: Date
}

export interface AccountInterface {
    id: number
    account: string
    name: string
    header: SVGInterface
    photo: SVGInterface
    headline: string
    dateCreation: Date
    followers: number
    following: Set<number>
    tweets: Array<number>
    retweets: Array<RetweetInterface>
    likes: Set<number>
}

export interface SVGInterface {
    width?: number
    height?: number
    shapes?: Array<SVGShapeInterface>
}

export interface SVGShapeInterface {
    kind: "rect" | "circle" | "ellipse"
    x?: number
    y?: number
    cx?: number
    cy?: number
    r?: number
    rx?: number
    ry?: number
    width?: number | string,
    height?: number | string,
    style?: {
        fill?: string
    }
}

const defaultAccount: AccountInterface = {
    id: 0,
    account: "",
    name: "",
    header: {},
    photo: {},
    headline: "",
    dateCreation: new Date(),
    followers: 0,
    following: new Set(),
    tweets: [],
    retweets: [],
    likes: new Set()
}

const defaultTweet: TweetInterface = {
    id: 0,
    account: 0,
    text: "",
    date: new Date(),
    replies: [],
    retweet: new Set(),
    likes: new Set()
}

const listProperties = (o: any): string => {
    const propertiesList = Object.keys(o!).join(",")
    return propertiesList
}
export var AAA = {
    b: 0
}

export class DatabaseY extends Dexie {
    isInitializing?: Promise<void>
    accounts!: Table<AccountInterface>
    tweets!: Table<TweetInterface>

    constructor() {
        super("Database")
        this.version(2).stores({
            accounts: "id, account",
            tweets: "id, account",
        }).upgrade((tx) => {
            tx.table("accounts").clear().then(() => {
                tx.table("tweets").clear()
            })
        })
    }

    async init() {
        await this.transaction("rw", this.accounts, this.tweets, async() => {
            if (await this.tweets.count() == 0) {
                await this.accounts.clear()
                await this.tweets.clear()

                let seedCreator = new SeedCreator(this)
                await seedCreator.createSeed()
            }
        })
    }

    async getAccount(id: number): Promise<AccountInterface | undefined> {
        return await this.accounts.get(id)
    }

    async bulkGetAccount(ids: Array<number>): Promise<Array<AccountInterface | undefined>> {
        return await this.accounts.bulkGet(ids)
    }

    async getAccountWithStringId(name: string): Promise<AccountInterface | undefined> {
        return await this.accounts.where("account").equals(name).first()
    }

    async getAccountCount(): Promise<number> {
        return await this.accounts.count()
    }

    async getTweet(id: number) {
        return await this.tweets.get(id)
    }

    async getTweetsReplied(id: number) {
        let tweet = (await this.getTweet(id))!
        let tweets: Array<TweetInterface> = []

        while (tweet.isReply) {
            tweets.push((await this.getTweet(tweet.isReply))!)
            tweet = (await this.getTweet(tweet.isReply))!
        }

        return tweets
    }

    async getTweetCount() {
        return await this.tweets.count()
    }

    async bulkGetTweet(ids: Array<number>): Promise<Array<TweetInterface | undefined>> {
        return await this.tweets.bulkGet(ids)
    }


    async addTweet(accountId: number, text: string, media?: SVGInterface, reply?: number) {
        await this.transaction("rw", this.accounts, this.tweets, async() => {
            let tweetCount = await this.tweets.count()
            let account = (await this.accounts.get(accountId))!
            account!.tweets.push(tweetCount)

            if (reply) {
                let tweetReplied = (await this.tweets.get(reply!))!
                tweetReplied.replies.push(tweetCount)
                await this.tweets.put(tweetReplied)
            }

            let tweet: TweetInterface = {
                id: tweetCount,
                account: accountId,
                text: text,
                media: media,
                date: new Date(),
                isReply: reply,
                replies: new Array(),
                retweet: new Set(),
                likes: new Set()
            }

            await this.tweets.add(tweet)
            await this.accounts.put(account)
        })
    }

    async likeTweet(accountId: number, tweetId: number) {
        await this.transaction("rw", this.accounts, this.tweets, async() => {
            let account = (await this.accounts.get(accountId))!
            let tweet = (await this.tweets.get(tweetId))!
            
            account.likes.add(tweetId)
            tweet.likes.add(accountId)

            await this.accounts.put(account)
            await this.tweets.put(tweet)
        })
    }

    async reTweet(accountId: number, tweetId: number) {
        await this.transaction("rw", this.accounts, this.tweets, async() => {
            let account = (await this.accounts.get(accountId))!
            let tweet = (await this.tweets.get(tweetId))!
            
            account.retweets.push({ id: tweetId, date: new Date() })
            tweet.retweet.add(accountId)

            await this.accounts.put(account)
            await this.tweets.put(tweet)
        })
    }

    async removeReTweet(accountId: number, tweetId: number) {
        await this.transaction("rw", this.accounts, this.tweets, async() => {
            let account = (await this.accounts.get(accountId))!
            let tweet = (await this.tweets.get(tweetId))!
            
            let index = account.retweets.findIndex(r => { return r.id == tweetId })
            if (index == -1) { return }

            account.retweets.splice(index, 1)
            tweet.retweet.delete(accountId)

            await this.accounts.put(account)
            await this.tweets.put(tweet)
        })
    }

    async removeLikeTweet(accountId: number, tweetId: number) {
        await this.transaction("rw", this.accounts, this.tweets, async() => {
            let account = (await this.accounts.get(accountId))!
            let tweet = (await this.tweets.get(tweetId))!
            
            account.likes.delete(tweetId)
            tweet.likes.delete(accountId)

            await this.accounts.put(account)
            await this.tweets.put(tweet)
        })
    }

    async clear() {
        await this.transaction("rw", this.accounts, this.tweets, async() => {
            await this.accounts.clear()
            await this.tweets.clear()
        })
    }

    async reset() {
        await this.transaction("rw", this.accounts, this.tweets, async() => {
            await this.clear()
            await this.init()
        })
    }
}

export class DatabaseWrapper {
    private db: DatabaseY

    constructor() {
        this.db = new DatabaseY()
    }

    async init() {
        await this.db.init()
    }

    async getAccount(id: number): Promise<AccountInterface | undefined> {
        return await this.db.getAccount(id)
    }

    async bulkGetAccount(ids: Array<number>): Promise<Array<AccountInterface | undefined>> {
        return await this.db.bulkGetAccount(ids)
    }

    async getAccountWithStringId(name: string): Promise<AccountInterface | undefined> {
        return await this.db.getAccountWithStringId(name)
    }

    async getAccountCount(): Promise<number> {
        return await this.db.getAccountCount()
    }

    async getTweet(id: number): Promise<TweetInterface | undefined> {
        return await this.db.getTweet(id)
    }

    async getTweetsReplied(id: number): Promise<Array<TweetInterface>> {
        return await this.db.getTweetsReplied(id)
    }

    async bulkGetTweet(ids: Array<number>): Promise<Array<TweetInterface | undefined>> {
        return await this.db.bulkGetTweet(ids)
    }

    async getTweetCount() {
        return await this.db.getTweetCount()
    }

    async addTweet(accountId: number, text: string, media?: SVGInterface, reply?: number) {
        await this.db.addTweet(accountId, text, media, reply)
    }
    
    async likeTweet(accountId: number, tweetId: number) {
        await this.db.likeTweet(accountId, tweetId)
    }

    async reTweet(accountId: number, tweetId: number) {
        await this.db.reTweet(accountId, tweetId)
    }

    async removeReTweet(accountId: number, tweetId: number) {
        await this.db.removeReTweet(accountId, tweetId)
    }

    async removeLikeTweet(accountId: number, tweetId: number) {
        await this.db.removeLikeTweet(accountId, tweetId)
    }

    async clear() {
        await this.db.clear()
    }

    async reset() {
        await this.db.reset()
    }
}