import React from "react"
import { Button, Spin } from 'antd'
import { useHistory } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, CommonTable, Attachment } from '../../common'
import { baseInfoData, cargoVOListColumns, portedCargoColumns } from "./baseInfo.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'

interface OverviewProps {
    id: string
}

export default function Overview({ id }: OverviewProps) {
    const history = useHistory()

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/projectInfo/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))

    return <DetailContent operation={[
        <Button key="edit" style={{ marginRight: '16px' }}
            type="primary" onClick={() => history.push(`/project/management/edit/base/${id}`)}>编辑</Button>,
        <Button key="goback" onClick={() => history.go(-1)}>返回</Button>
    ]}>
        <Spin spinning={loading}>
            <DetailTitle title="基本信息" style={{ padding: "0 0 8px 0", }} />
            <BaseInfo columns={baseInfoData.map((item: any) => {
                if (["projectLeader", "biddingPerson"].includes(item.dataIndex)) {
                    return ({ title: item.title, dataIndex: item.dataIndex })
                }
                if (item.dataIndex === "address") {
                    return ({
                        ...item,
                        render: (record: any) => `${["null", null].includes(record.bigRegion) ? "" : record.bigRegion}-${["null", null].includes(record.address) ? "" : record.address}`
                    })
                }
                return item
            }).filter((item: any) => !(item.dataIndex === "country" && data?.address !== "其他-国外"))} dataSource={data || {}} />
            <DetailTitle title="物资清单" />
            <CommonTable haveIndex columns={cargoVOListColumns} dataSource={data?.cargoVOList} />
            <DetailTitle title="整理后物资清单" />
            <CommonTable haveIndex columns={portedCargoColumns} dataSource={data?.portedCargoVOList} />
            <Attachment dataSource={data?.attachVos || []} />
        </Spin>
    </DetailContent>
}