import { AccountInterface, DatabaseY, TweetInterface, SVGInterface, SVGShapeInterface } from "./db"

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


export async function createSeed(db: DatabaseY, amountAccounts: number, amountTweetsAccounts: number) {
    var seed = []
    var tweets = []
    for (let i = 0; i < amountAccounts; i+=1) {
        let name = generatePseudo()
        let headline = generateText(8)
        let tweetsAccount = []
        for (let j = 0; j < amountTweetsAccounts; j+=1) {
            let tweet_id: number = tweets.length
            let tweet = createTweet(tweet_id, i)
            tweets.push(tweet)
            tweetsAccount.push(tweet.id)
        }
        const new_account: AccountInterface = {
            id: i,
            account: name,
            name: name,
            header: createSVG(),
            photo: createSVG(),
            headline: headline,
            dateCreation: new Date(),
            followers: 0,
            following: new Set(),
            tweets: tweetsAccount,
            likes: new Set()
        }
        seed.push(new_account)
    }

    for (var ac of seed) {
        let following = []
        let following_num = Math.floor(Math.random() * amountAccounts)

        for (let i = 0; i < following_num; i += 1) {
            let to_follow = Math.floor(Math.random() * amountAccounts)
            if (ac.following.has(to_follow)) { continue }
            ac.following.add(to_follow)
            seed[to_follow].followers += 1
        }

        let tweets_num = Math.floor(Math.random() * 200)
        let tweetsCount = tweets.length
        for (let i = 0; i < tweets_num; i += 1) {
            let tweet = tweets[Math.floor(Math.random() * tweetsCount)]
            ac.likes.add(tweet.id)
            tweet.likes.add(ac.id)
        }
    }
    
    await db.accounts.bulkPut(seed)
    await db.tweets.bulkPut(tweets)
}

function createSVG(): SVGInterface {
    let amountShapes = Math.max(Math.floor(Math.random() * 100), 50)
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

function generatePseudo(): string {
    let name = names[Math.floor(Math.random() * names.length)]
    let number = Math.floor(Math.random() * 1_000)

    let string = name + number.toString()

    return string
}

function generateText(amountWords: number): string {
    var text = ""
    var uppercase = true
    for (let i = 0; i < amountWords; i += 1) {
        let word = wordsRandom[Math.floor(Math.random() * wordsRandom.length)]
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

function createTweet(id: number, account: number): TweetInterface {
    const amountWords = Math.max(Math.floor(Math.random() * 50), 5)
    const text = generateText(amountWords)
    const tweet = {
        id: id,
        account: account,
        text: text,
        date: new Date(),
        comments: [],
        retweet: [],
        likes: new Set<number>()
    }
    
    return tweet
}
