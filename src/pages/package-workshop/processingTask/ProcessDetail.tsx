import React, { useState } from 'react'
import { Button, Form, message, Modal, Popconfirm, Space, Spin, Table } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { BaseInfo, DetailContent, CommonTable, DetailTitle } from '../../common';
import { baseInfoData } from './detail.json';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import WorkshopUserSelectionComponent, { IUser } from '../../../components/WorkshopUserModal';



export default function ProcessDetail(): React.ReactNode {
    const history = useHistory();
    const [form] = Form.useForm();
    const params = useParams<{ id: string, status: string }>();
    const [visible, setVisible] = useState<boolean>(false);
    const [tableDataSource,setTableDataSource] = useState<any>([]);
    const [userDataSource,setUserDataSource] = useState<any>([]);
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        // let data = await RequestUtil.get(``,{})
        resole(data)
    }), {})
    const detailData: any = data;
    const delRow = (index: number) => {
        userDataSource.splice(index, 1);
        setUserDataSource([...userDataSource]);
    }
    const tableColumns = [
        { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
        { title: '杆塔号', dataIndex: 'createDeptName', key: 'createDeptName', },
        { title: '呼高', dataIndex: 'createUserName', key: 'createUserName' },
        { title: '入库重量', dataIndex: 'createTime', key: 'createTime' },
        { title: '总基数', dataIndex: 'description', key: 'description' },
        { title: '包装清单', dataIndex: 'operation', key: 'operation',render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            <Button type="link" onClick={()=>{
                history.push(`/packagingWorkshop/processingTask/detail/${params.id}/${params.status}/detail/${record.id}`)
            }}>明细</Button>
        ) }
    ]
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={params.status!=='3'?[
                <Button key="edit" style={{ marginRight: '10px' }} type="primary" onClick={async () => {
                    history.push(`/packagingWorkshop/processingTask/detail/${params.id}/${params.status}/wareHouse`)
                }}>采集入库</Button>,
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]:[
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
                <DetailTitle title="包装任务基本信息" />
                <BaseInfo columns={baseInfoData} dataSource={detailData || {}}/>
                <DetailTitle title="任务明细" />
                <CommonTable 
                    columns={tableColumns}
                    dataSource={tableDataSource} 
                    pagination={false}
                />
            </DetailContent>
        </Spin>
    </>
}