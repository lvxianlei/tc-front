import React from 'react'
import { Button, Spin, Space } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { BaseInfo, DetailContent, CommonTable, DetailTitle } from '../../common';
import { specialInfoData, productInfoData } from './sample.json';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';

const tableColumns = [
    { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
    { title: '操作部门', dataIndex: 'opreateUserDeptName', key: 'opreateUserDeptName', },
    { title: '操作人', dataIndex: 'opreateUserName', key: 'opreateUserName' },
    { title: '操作时间', dataIndex: 'createTime', key: 'createTime' },
    { title: '任务状态', dataIndex: 'status', key: 'status', render: (value: number, record: object): React.ReactNode => {
        const renderEnum: any = [
            {
                value: 1,
                label: "待修改"
            },
            {
                value: 2,
                label: "已修改"
            },
            {
                value: 3,
                label: "已拒绝"
            },
            {
                value: 4,
                label: "已删除"
            }
        ]
             return <>{value && renderEnum.find((item: any) => item.value === value).label}</>
    }}
]

export default function SampleDrawMessage(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/smallSample/${params.id}`)
        resole(data)
    }), {})
    const detailData: any = data
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
                <DetailTitle title="特殊要求" />
                <BaseInfo columns={specialInfoData} dataSource={detailData || {}} col={2}/>
                <DetailTitle title="产品信息" />
                <BaseInfo columns={productInfoData} dataSource={detailData?.productVO || {}} col={2}/>
                <DetailTitle title="相关附件"/>
                <CommonTable columns={[
                    {
                        title: '附件名称',
                        dataIndex: 'name',
                        key: 'name',
                    },
                    {
                        key: 'operation',
                        title: '操作',
                        dataIndex: 'operation',
                        render: (_: undefined, record: any): React.ReactNode => (
                            <Space direction="horizontal" size="small">
                                <Button type='link'>下载</Button>
                            </Space>
                        )
                    }
                ]} dataSource={detailData?.attachVos} />
                <DetailTitle title="操作信息" />
                <CommonTable columns={tableColumns} dataSource={detailData?.cargoVOList} />
            </DetailContent>
        </Spin>
    </>
}