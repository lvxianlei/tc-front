import React from "react"
import { DetailContent, BaseInfo } from '../../common'
import { servicecharge, promotiondetails } from './payInfo.json'
interface OverViewProps {
    data: any
}
export default function Overview({ data }: OverViewProps): JSX.Element {
    return <DetailContent>
        <BaseInfo columns={[
            ...(data.costType === 2 ? promotiondetails : servicecharge)
        ]} dataSource={data} />
    </DetailContent >
}