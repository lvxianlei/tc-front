import React, { useState } from "react"
import { Result, Spin, Modal, Button } from "antd"
import { useParams } from "react-router-dom"
import { DetailContent, CommonTable } from '../../common'
import { payInfoListHead } from './payInfo.json'
import type { TabTypes } from "../Detail"
import Overview from "./Overview"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
type PayTypes = 2 | 3

const payTypeEnum: { [key: number]: any } = {
    2: "投标保证金",
    3: "中标服务费"
}

export default function PayInfo() {
    const [visible, setVisible] = useState<boolean>(false)
    const [payType, setPayType] = useState<PayTypes>(2)
    const [payInfoData, setPayInfoData] = useState<any>()
    const params = useParams<{ id: string, tab?: TabTypes }>()
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/payApply/getPayInfo`, { projectId: params.id })
            resole(result)
            return
        } catch (error) {
            reject(error)
        }
    }))

    if (data?.length <= 0) {
        return <Result style={{ paddingTop: 200 }} title="当前项目还未产生费用" />
    }

    return <Spin spinning={loading} >
        <DetailContent>
            <Modal
                width={1011}
                visible={visible}
                title={payTypeEnum[payType]}
                onCancel={() => setVisible(false)} onOk={() => setVisible(false)}
                footer={[
                    <Button key="ok" type="primary" onClick={() => setVisible(false)}>
                        确认
                    </Button>
                ]}
            >
                <Overview data={payInfoData} />
            </Modal>
            <CommonTable columns={[
                ...payInfoListHead,
                {
                    title: "操作",
                    dataIndex: "opration",
                    render: (_: any, records: any) => [2, 3].includes(records.costType) ? <a onClick={() => {
                        setVisible(true)
                        setPayType(records.costType)
                        setPayInfoData(records)
                    }} >详情</a> : <>-</>
                }
            ]} dataSource={(data as any) || []} />
        </DetailContent>
    </Spin>
}