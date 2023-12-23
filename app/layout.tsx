import "./global.css"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Y social network",
}

export default function RootLayout({ children } : { children: React.ReactNode }) {
    return(
        <html lang="en">
            <body>
                { children }
            </body>
        </html>
    )
}