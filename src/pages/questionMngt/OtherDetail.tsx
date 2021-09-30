import React from 'react'
import { Button, Spin } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { BaseInfo, DetailContent, CommonTable, DetailTitle } from '../common';
import { baseInfoData } from './question.json';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../utils/RequestUtil';

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
    { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
    { title: '段名', dataIndex: 'segmentName', key: 'segmentName', },
    { title: '构件编号', dataIndex: 'code', key: 'code' },
    { title: '材料名称', dataIndex: 'materialName', key: 'materialName' },
    { title: '材质', dataIndex: 'structureTexture', key: 'structureTexture' },
    { title: '规格', dataIndex: 'structureSpec', key: 'structureSpec' },
    { title: '单基件数', dataIndex: 'basicsPartNum', key: 'basicsPartNum' },
    { title: '长度', dataIndex: 'length', key: 'length' },
    { title: '宽度', dataIndex: 'width', key: 'width' },
    { title: '理算重量（kg）', dataIndex: 'basicsTheoryWeight', key: 'basicsTheoryWeight' },
    { title: '单件重量（kg）', dataIndex: 'basicsWeight', key: 'basicsWeight' },
    { title: '小计重量（kg）', dataIndex: 'totalWeight', key: 'totalWeight' },
    { title: '备注', dataIndex: 'description', key: 'description' }
]

export default function OtherDetail(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string, type: string }>()
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        let data:any = {};
        if(params.type==='1'){
            data = await RequestUtil.get(`/tower-science/issue/material/${params.id}`);
        }
        else if(params.type==='2'){
            data = await RequestUtil.get(`/tower-science/issue/lifting/${params.id}`);
        }
        else if(params.type==='3'){
            data= await RequestUtil.get(`/tower-science/issue/bolt/${params.id}`);
        }
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
                <BaseInfo columns={baseInfoData} dataSource={detailData || {}} col={2}/>
                <CommonTable columns={towerColumns} dataSource={detailData?.drawProductStructure} />
                <DetailTitle title="操作信息" />
                <CommonTable columns={tableColumns} dataSource={detailData?.issueRecordList} />
            </DetailContent>
        </Spin>
    </>
}