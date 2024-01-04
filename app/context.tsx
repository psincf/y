import { createContext } from "react";
import { AccountInterface, DatabaseWrapper } from "@/db/db";

interface localAccountContextInterface {
    localAccount: AccountInterface | undefined
    setLocalAccount: (acc: AccountInterface) => void
}
 
export const LocalAccountContext = createContext<localAccountContextInterface>({
    localAccount: undefined,
    setLocalAccount: (acc: AccountInterface) => {}
})
export const dbContext = createContext(new DatabaseWrapper())
export const DbLoadedContext = createContext({
    db: false,
    setDb: (b: boolean) => {}
})