import React from "react"
import { OperationRecord } from "../../../common"
const recordEnum: { [key: string]: any } = {
    signIn: "签收日志",
    opration: "操作日志",
    examine: "审核日志"
}
interface EditProps {
    id: "create" | string
    type: "signIn" | "opration" | "examine"
}

export default function Records({ id, type }: EditProps) {
    return <>
        {type === "opration" && <OperationRecord
            serviceId={id}
            serviceName="tower-system"
        />}
    </>
}