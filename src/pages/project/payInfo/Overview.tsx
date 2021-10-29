import React from "react"
import { Button } from "antd"
import { DetailContent, BaseInfo } from '../../common'
import { servicecharge, promotiondetails } from './payInfo.json'
interface OverViewProps {
    data: any
}
export default function Overview({ data }: OverViewProps): JSX.Element {

    return <DetailContent>
        <BaseInfo columns={[
            ...(data.payType === 2 ? servicecharge : promotiondetails),
            {
                title: "操作",
                dataIndex: "opration",
                render: () => <>
                    <Button type="link">详情</Button>
                </>
            }
        ]} dataSource={data} />
    </DetailContent >
}