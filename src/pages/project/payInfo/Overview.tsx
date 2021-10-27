import React from "react"
import { Spin, Button } from "antd"
import { DetailContent, BaseInfo } from '../../common'
import { servicecharge, promotiondetails } from './payInfo.json'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
type PayType = 2 | 3
interface OverViewProps {
    payType: PayType
    payInfoId: number | undefined
}
export default function Overview({ payType, payInfoId }: OverViewProps): JSX.Element {
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/payApply/`)
            resole(result)
            return
        } catch (error) {
            reject(error)
        }
    }), {
        refreshDeps: [payInfoId]
    })
    return <Spin spinning={loading} >
        <DetailContent>
            <BaseInfo columns={[
                ...(payType === 2 ? servicecharge : promotiondetails),
                {
                    title: "操作",
                    dataIndex: "opration",
                    render: () => <>
                        <Button type="link">详情</Button>
                    </>
                }
            ]} dataSource={[]} />
        </DetailContent>
    </Spin>
}