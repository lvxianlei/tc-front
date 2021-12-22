import React from "react"
import { Result } from "antd"
import { useParams } from "react-router"
export default function Notice() {
    const { name } = useParams<{ name: string }>()
    if (name !== "chooseApply") {
        return <Result
            status="404"
            title={name}
        />
    }
    return <></>
}