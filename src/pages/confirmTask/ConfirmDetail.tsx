import React from 'react'
import { Button, Spin, Space} from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle } from '../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../utils/RequestUtil';
import TextArea from 'antd/lib/input/TextArea';

const towerColumns=[
    {
        key: 'index',
        title: '序号',
        dataIndex: 'index',
        width: 50,
        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
    },
    {
        key: 'projectName',
        title: '线路名称',
        width: 100,
        dataIndex: 'projectName'
    },
    {
        key: 'projectName',
        title: '杆塔号',
        width: 100,
        dataIndex: 'projectName'
    },
    {
        key: 'projectName',
        title: '塔型',
        width: 100,
        dataIndex: 'projectName'
    },
    {
        key: 'projectName',
        title: '塔型钢印号',
        width: 100,
        dataIndex: 'projectName'
    },
    {
        key: 'projectName',
        title: '产品类型',
        width: 100,
        dataIndex: 'projectName'
    },
    {
        key: 'projectName',
        title: '电压等级（kv）',
        width: 100,
        dataIndex: 'projectName'
    },
    {
        key: 'projectName',
        title: '呼高（m）',
        width: 100,
        dataIndex: 'projectName'
    },
    {
        key: 'projectName',
        title: '其他增重（kg）',
        width: 100,
        dataIndex: 'projectName'
    },
    {
        key: 'projectName',
        title: '总重（kg）',
        width: 100,
        dataIndex: 'projectName'
    },
    {
        key: 'projectName',
        title: '备注',
        width: 100,
        dataIndex: 'projectName'
    }
]

export default function ConfirmDetail(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/drawTask/getList/${params.id}`)
        resole(data)
    }), {})
    const detailData: any = data;
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
            <DetailTitle title="杆塔信息"/>
            <CommonTable columns={towerColumns} dataSource={detailData?.drawProductDetailVOList} />
            <DetailTitle title="备注"/>
            <TextArea maxLength={500} showCount rows={3} value={detailData?.description} disabled/>
            <DetailTitle title="附件"/>
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
                            <Button type='link'>预览</Button>
                        </Space>
                    )
                }
            ]} dataSource={detailData?.attachInfoVOList} />
            </DetailContent>
        </Spin>
    </>
}