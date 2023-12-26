import { createContext } from "react";
import { DatabaseY } from "@/db/db";

export const dbContext = createContext(new DatabaseY())
export const DbLoadedContext = createContext({
    db: false,
    setDb: (b: boolean) => {}
})