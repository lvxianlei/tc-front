import React from "react"
import { OperationRecord } from "../common"
interface OpreationProps {
    id: string
}

export default function Opreation({ id }: OpreationProps): JSX.Element {
    return <OperationRecord title="" serviceId={id} serviceName="tower-supply" />
}