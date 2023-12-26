import React from "react"

import Dexie, { Table } from "dexie"
import { SeedCreator } from "./seed"

const amountAccounts = 100
const amountTweetsAccounts = 10

export interface TweetInterface {
    id: number
    account: number
    text: string
    media?: SVGInterface,
    date: Date
    comments: Array<number>
    retweet: Array<number>
    likes: Set<number>
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
    likes: Set<number>
}

export interface SVGInterface {
    width?: number,
    height?: number,
    shapes?: Array<SVGShapeInterface>
}

export interface SVGShapeInterface {
    kind: "rect"
    x?: number,
    y?: number,
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
    likes: new Set()
}

const defaultTweet: TweetInterface = {
    id: 0,
    account: 0,
    text: "",
    date: new Date(),
    comments: [],
    retweet: [],
    likes: new Set()
}

const listProperties = (o: any): string => {
    const propertiesList = Object.keys(o!).join(",")
    return propertiesList
}

export class DatabaseY extends Dexie {
    accounts!: Table<AccountInterface>
    tweets!: Table<TweetInterface>

    constructor() {
        super("Database")
        this.version(1).stores({
            //accounts: "id, account",
            accounts: listProperties(defaultAccount),
            //tweets: "id, account",
            tweets: listProperties(defaultTweet)
        })
    }

    async init() {
        if (await this.tweets.count() == 0) {
            await this.accounts.clear()
            await this.tweets.clear()

            let seedCreator = new SeedCreator(this, amountAccounts, amountTweetsAccounts)
            await seedCreator.createSeed()
        }
    }

    async clear() {
        await this.accounts.clear()
        await this.tweets.clear()
    }

    async reset() {
        await this.clear()
        await this.init()
    }
}