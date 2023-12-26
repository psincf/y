import "@/app/overflowy.css"

import React from "react";
import { Settings } from "@/components/settings/settings";
import { Aside } from "@/components/aside/aside";

import styles from "./styles.module.css"

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    return(
        <div className={styles.page}>
            <Settings></Settings>
            { children }
            <Aside></Aside>
        </div>
    )
}