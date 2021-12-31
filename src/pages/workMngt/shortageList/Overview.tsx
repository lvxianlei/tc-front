import React from "react"

import { OperationRecord } from '../../common'
interface OverviewProps {
    id: string
}
export default function Overview({ id }: OverviewProps) {

    return <OperationRecord title={false} serviceId={id} serviceName="tower-supply" />
}