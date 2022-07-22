import React, { useState } from "react"
import { useHistory } from "react-router-dom"
import { Modal } from "antd"

interface PromptProps {
    when?: boolean
    message?: string
}

export default function Prompt({ when, message }: PromptProps) {
    const history = useHistory()
    const [visible, setVisible] = useState(false)
    history.block((tx: any) => {
        console.log(tx, "------")
        let url = tx.pathname;
        setVisible(true)
        // return 
    })
    return <Modal title="提示" visible={visible}>
        <div>aaaaaaaaaa</div>
    </Modal>
}