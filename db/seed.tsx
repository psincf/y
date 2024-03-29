import { AccountInterface, DatabaseY, TweetInterface, SVGInterface, SVGShapeInterface } from "./db"


const amountAccounts = 200
const amountTweetsAccounts = 10
const amountReTweetsAccounts = 2
const followingNum = 100
const tweetsLike = 100


const names = [
    "James",
    "John",
    "Robert",
    "Michael",
    "William",
    "Mary",
    "Patricia",
    "Linda",
    "Barbara",
    "Elizabeth"
]

const wordsRandom = `
lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor
incididunt ut labore et dolore magna aliqua enim ad minim veniam
`.replaceAll("\n", "").split(" ")

export class SeedCreator {
    db: DatabaseY
    amountAccounts: number
    amountTweetsAccounts: number

    accounts: Array<AccountInterface> = []
    tweets: Array<TweetInterface> = []

    constructor(db: DatabaseY) {
        this.db = db
        this.amountAccounts = amountAccounts
        this.amountTweetsAccounts = amountTweetsAccounts
    }

    async createSeed() {
        let time = Date.now()
        this.generateLocalAccount()
        for (let i = 1; i < this.amountAccounts; i+=1) {
            let name = this.generatePseudo()
            let headline = this.generateText(8)
            let tweetsAccount = new Array()
            const new_account: AccountInterface = {
                id: i,
                account: name,
                name: name,
                header: this.createSVG(),
                photo: this.createSVGPhoto(),
                headline: headline,
                dateCreation: new Date(Date.now() - 40_000_000_000),
                followers: 0,
                following: new Set(),
                tweets: tweetsAccount,
                retweets: [],
                likes: new Set()
            }
            this.accounts.push(new_account)
        }

        console.log("a", (Date.now() - time) / 1_000)

        const dateMin = Date.now() - 40_000_000_000
        const dateMax = Date.now()
        const numTweets = this.amountTweetsAccounts * this.accounts.length
    
        for (let j = 0; j < numTweets; j+=1) {
            let date = new Date((dateMax - dateMin) * (j / numTweets) + dateMin)
            let accountId = Math.max(Math.floor(Math.random() * (this.accounts.length - 1)), 1)
            let tweet_id: number = this.tweets.length
            let tweet = this.createTweet(tweet_id, accountId, date)
            this.tweets.push(tweet)
            this.accounts[accountId].tweets.push(tweet.id)
        }
        console.log("b", (Date.now() - time) / 1_000)

        for (var ac of this.accounts) {
            if (ac.id == 0) { continue }
            let following = []
            let following_num = Math.floor(Math.random() * followingNum)
    
            for (let i = 0; i < following_num; i += 1) {
                let to_follow = Math.floor(Math.random() * this.amountAccounts)
                if (ac.following.has(to_follow)) { continue }
                ac.following.add(to_follow)
                this.accounts[to_follow].followers += 1
            }
    
            let tweets_num = Math.floor(Math.random() * tweetsLike)
            let tweetsCount = this.tweets.length
            for (let i = 0; i < tweets_num; i += 1) {
                let tweet = this.tweets[Math.floor(Math.random() * tweetsCount)]
                ac.likes.add(tweet.id)
                this.tweets[tweet.id].likes.add(ac.id)
            }

            for (let i = 0; i < amountReTweetsAccounts; i += 1) {
                let tweet = this.tweets[Math.floor(Math.random() * tweetsCount)]

                let date = new Date(dateMax - 40_000_000_000 * Math.random())
                ac.retweets.push({ id: tweet.id, date: date })
                this.tweets[tweet.id].retweet.add(ac.id)
            }
        }

        console.log("1", (Date.now() - time) / 1_000)

        await this.db.accounts.bulkPut(this.accounts)
        await this.db.tweets.bulkPut(this.tweets)

        console.log("2", (Date.now() - time) / 1_000)
    }

    createSVG(): SVGInterface {
        let amountShapes = Math.max(Math.floor(Math.random() * 10), 5)
        let shapes: Array<SVGShapeInterface> = [];
        let o_c = [Math.random() * 255, Math.random() * 255, Math.random() * 255]
        let background_color = `rgb(
            ${(Math.random() - 0.5) * 100 + o_c[0]},
            ${(Math.random() - 0.5) * 100 + o_c[1]},
            ${(Math.random() - 0.5) * 100 + o_c[2]}
        )`

        shapes.push({
            kind: "rect",
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            style: {
                fill: background_color
            }
        })

        for (let i = 0; i < amountShapes; i += 1) {
            let x = Math.random() * 150 - 50
            let y = Math.random() * 150 - 50
            let width = Math.max(Math.random() * 10, 20)
            let height = Math.max( Math.random() * 10, 20)
            let color = `rgb(
                ${(Math.random() - 0.5) * 50 + o_c[0]},
                ${(Math.random() - 0.5) * 50 + o_c[1]},
                ${(Math.random() - 0.5) * 50 + o_c[2]}
            )`

            let shape: SVGShapeInterface = {
                kind: "rect",
                x: x,
                y: y,
                width: width,
                height: height,
                style: {
                    fill: color
                }
            }
            shapes.push(shape)
        }

        let svg: SVGInterface = {
            width: 100,
            height: 100,
            shapes: shapes
        }

        return svg
    }

    createSVGPhoto(): SVGInterface {
        let shapes: Array<SVGShapeInterface> = [];
        let o_c = [Math.random() * 255, Math.random() * 255, Math.random() * 255]
        let background_color = `rgb(
            ${(Math.random() - 0.5) * 100 + o_c[0]},
            ${(Math.random() - 0.5) * 100 + o_c[1]},
            ${(Math.random() - 0.5) * 100 + o_c[2]}
        )`
        
        background_color = `rgb(
            ${o_c[0] > 128 ? o_c[0] - 64 : o_c[0] + 64},
            ${o_c[1] > 128 ? o_c[1] - 64 : o_c[1] + 64},
            ${o_c[2] > 128 ? o_c[2] - 64 : o_c[2] + 64}
        )`

        shapes.push({
            kind: "rect",
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            style: {
                fill: background_color
            }
        })

        let color = `rgb(
            ${o_c[0]},
            ${o_c[1]},
            ${o_c[2]}
        )`

        let head: SVGShapeInterface = {
            kind: "circle",
            cx: 50,
            cy: 25,
            r: 20,
            style: {
                fill: color
            }
        }

        shapes.push(head)

        let body: SVGShapeInterface = {
            kind: "ellipse",
            cx: 50,
            cy: 90,
            rx: 30,
            ry: 50,
            style: {
                fill: color
            }
        }

        shapes.push(body)

        let svg: SVGInterface = {
            width: 100,
            height: 100,
            shapes: shapes
        }

        return svg
    }

    generatePseudo(): string {
        let name = names[Math.floor(Math.random() * names.length)]
        let number = Math.floor(Math.random() * 1_000)

        let string = name + number.toString()

        return string
    }

    generateText(amountWords: number): string {
        var text = ""
        var uppercase = true
        for (let i = 0; i < amountWords; i += 1) {
            let word = wordsRandom[Math.floor(Math.random() * wordsRandom.length)]
            if (Math.random() > 0.95 && this.accounts.length > 0) {
                word = "@" + this.accounts[Math.floor(Math.random() * this.accounts.length)].account
            }
            if (i > 0) {
                if (Math.random() > 0.9) {
                    text+= ","
                } else  if (Math.random() > 0.9) {
                    text+="."
                    uppercase = true
                }
                text+=" "
            }
            if (uppercase) {
                let word_begin = word.slice(0, 1).toUpperCase()
                let word_end = word.slice(1)
                word = word_begin + word_end
            }
            text += word
            if (i == amountWords - 1) {
                text += "."
            }
            uppercase = false
        }
        return text
    }

    createTweet(id: number, account: number, date?: Date): TweetInterface {
        const amountWords = Math.max(Math.floor(Math.random() * 50), 5)
        const text = this.generateText(amountWords)
        const tweet: TweetInterface = {
            id: id,
            account: account,
            text: text,
            date: date ? date : new Date(),
            replies: [],
            retweet: new Set(),
            likes: new Set<number>()
        }

        if (Math.random() > 0.9) {
            tweet.media = this.createSVG()
            tweet.media!.width! = Math.max(Math.random() * 400, 200)
            tweet.media!.height! = Math.max(Math.random() * 400, 200)
        }
        
        return tweet
    }

    generateLocalAccount() {
        this.accounts.push({
            id: 0,
            account: "Me",
            name: "Me",
            header: this.createSVG(),
            photo: this.createSVGPhoto(),
            headline: "",
            dateCreation: new Date(),
            followers: 0,
            following: new Set(),
            tweets: new Array(),
            retweets: [],
            likes: new Set()
        })
    }
}
