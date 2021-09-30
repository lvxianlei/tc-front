import React from 'react'
import { Button, Spin, Space } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle } from '../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../utils/RequestUtil';
import TextArea from 'antd/lib/input/TextArea';

const tableColumns = [
    { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
    { title: '操作部门', dataIndex: 'updateDepartmentName', key: 'updateDepartmentName', },
    { title: '操作人', dataIndex: 'updateUserName', key: 'updateUserName' },
    { title: '操作时间', dataIndex: 'updateTime', key: 'updateTime' },
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
             return <>{renderEnum.find((item: any) => item.value === value).label}</>
    }},
    { title: '备注', dataIndex: 'description', key: 'description' }
]

const towerColumns = [
    { title: '零件号', dataIndex: 'partId', key: 'partId', },
    { title: '材料', dataIndex: 'materialName', key: 'materialName' },
    { title: '材质', dataIndex: 'structureTexture', key: 'structureTexture' },
    { title: '规格', dataIndex: 'structureSpec', key: 'structureSpec' },
    { title: '长度（mm）', dataIndex: 'length', key: 'length' },
    { title: '单组件数', dataIndex: 'singleNum', key: 'singleNum' },
    { title: '电焊长度（mm）', dataIndex: 'electricWeldingMeters', key: 'electricWeldingMeters' }
]

export default function AssemblyWeldDetail(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/issue/combinedWelding/${params.id}`)
        resole(data)
    }), {})
    const detailData: any = data
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
               <Button key="edit" style={{ marginRight: '10px' }} type="primary" onClick={async () => {
                    await RequestUtil.post(`/tower-science/issue/verify/${params.id}`).then(()=>{
                        history.goBack()
                    })
                }}>确认修改</Button>,
                <Button key="edit" style={{ marginRight: '10px' }} type="primary" onClick={async () => {
                    await RequestUtil.post(`/tower-science/issue/refuse/${params.id}`).then(()=>{
                        history.goBack()
                    })
                }}>拒绝修改</Button>,
                <Button key="edit" style={{ marginRight: '10px' }} type="primary" onClick={async () => {
                    await RequestUtil.delete(`/tower-science/issue/${params.id}`).then(()=>{
                        history.goBack()
                    })
                }}>删除</Button>,
                    <Button key="goback" onClick={() => history.goBack()}>返回</Button>
                ]}>
                <DetailTitle title="问题信息" />
                <span>校核前</span>
                <CommonTable columns={towerColumns} dataSource={detailData?.weldingDetailedStructureList} title={()=>{
                    return <Space >
                        <span>段号：1</span>
                        <span>组件号：101</span>
                        <span>主见号：101</span>
                        <span>电焊米数（mm）：5</span>
                    </Space>
                }}/>
                <span>校核后</span>
                <CommonTable columns={towerColumns} dataSource={detailData?.weldingDetailedStructureVOList} title={()=>{
                    return <Space>
                        <span>段号：1</span>
                        <span>组件号：101</span>
                        <span>主见号：101</span>
                        <span>电焊米数（mm）：5</span>
                    </Space>
                }}/>
                <DetailTitle title="备注" />
                <TextArea disabled rows={5} value={detailData?.description}></TextArea>
                <DetailTitle title="操作信息" />
                <CommonTable columns={tableColumns} dataSource={detailData?.issueRecordList} />
            </DetailContent>
        </Spin>
    </>
}