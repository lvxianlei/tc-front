import React from "react"
import { Button, Spin } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, CommonTable } from '../common'
import { PaymentListHead, paymentdetail } from "./PaymentData.json"
import { enclosure } from '../project/managementDetailData.json'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
import { downLoadFile } from "../../utils"
export default function Edit() {
    const history = useHistory()
    const params = useParams<{ id: string }>()

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/payApply/${params.id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))

    return <DetailContent operation={[
        <Button key="cancel" onClick={() => history.go(-1)}>返回</Button>
    ]}>
        <Spin spinning={loading}>
            <DetailTitle title="基本信息" />
            <BaseInfo columns={PaymentListHead} dataSource={(data as any) || {}} />
            <DetailTitle title="请款明细" />
            <CommonTable columns={paymentdetail} dataSource={data?.payInfoVOList || []} />
            <DetailTitle title="附件信息" />
            <CommonTable columns={[{
                title: '操作',
                width: 60,
                dataIndex: 'opration',
                render: (_a: any, _b: any): React.ReactNode => (<Button
                    type="link"
                    onClick={() => downLoadFile(_b.filePath, _b.name)}
                >下载</Button>)
            },
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index',
                render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
            }, ...enclosure]} dataSource={data?.attachVos || []} />
        </Spin>
    </DetailContent>
}