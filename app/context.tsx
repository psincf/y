import { createContext } from "react";
import { DatabaseY } from "@/db/db";

export const dbContext = createContext(new DatabaseY())