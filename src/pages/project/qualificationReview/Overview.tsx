import React from "react"
import { Button, Spin } from 'antd'
import { useHistory, } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, CommonTable } from '../../common'
import { bidDocColumns } from "./qualificat.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import { bidTypeOptions, tenderDeliveryMethodOptions } from '../../../configuration/DictionaryOptions'
interface OverviewProps {
    id: string
}

export default function Overview({ id }: OverviewProps) {
    const history = useHistory()

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/bidDoc/${id}`, { type: 2 })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))

    return <DetailContent
        operation={[
            <Button key="edit" type="primary" style={{ marginRight: 16 }}
                onClick={() => history.push(`/project/management/edit/qualificationReview/${id}`)} >编辑</Button>,
            <Button key="goback" onClick={() => history.goBack()}>返回</Button>
        ]}>
        <Spin spinning={loading}>
            <DetailTitle title="标书制作记录表" style={{ padding: "0 0 8px 0", }} />
            <BaseInfo
                columns={bidDocColumns.map((item: any) => {
                    if (item.dataIndex === "bidType") {
                        return ({
                            ...item,
                            type: "select",
                            enum: bidTypeOptions?.map((bid: any) => ({ value: bid.id, label: bid.name }))
                        })
                    }
                    if (item.dataIndex === "deliverId") {
                        // 标书投递方式 需后台提供字典值
                        return ({
                            ...item,
                            type: "select",
                            enum: tenderDeliveryMethodOptions?.map((bid: any) => ({ value: bid.id, label: bid.name }))
                        })
                    }
                    return item
                })}
                dataSource={data || {}} col={4}
            />
            <DetailTitle title="填写记录" />
            <CommonTable rowKey="createTime" columns={[
                { title: '序号', dataIndex: 'index', width: 50, render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
                { title: '部门', width: 100, dataIndex: 'branch' },
                { title: '填写人', width: 100, dataIndex: 'createUserName' },
                { title: '职位', width: 100, dataIndex: 'position' },
                { title: '填写时间', width: 150, dataIndex: 'createTime' },
                { title: '说明', dataIndex: 'description' }
            ]} dataSource={data?.bidBizRecordVos} />
        </Spin>
    </DetailContent>
}