import React from "react"
import { useHistory } from "react-router-dom"

interface PromptProps {
    when: boolean
    message?: string
}

export default function Prompt({ when, message }: PromptProps) {
    const history = useHistory()
    history.block((tx: any) => {
        console.log(tx, "------")
        let url = tx.pathname;

    })
    return <div>
        abc............
    </div>
}