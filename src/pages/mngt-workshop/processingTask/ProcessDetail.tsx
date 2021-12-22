import React, { useState } from 'react'
import { Button, Form, message, Modal, Popconfirm, Space, Spin, Table } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { BaseInfo, DetailContent, CommonTable, DetailTitle } from '../../common';
import { baseInfoData } from './detail.json';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import WorkshopUserSelectionComponent, { IUser } from '../../../components/WorkshopUserModal';

const tableColumns = [
    { title: '工作中心', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
    { title: '班组', dataIndex: 'teamName', key: 'teamName'},
    { title: '实际完成时间', dataIndex: 'description', key: 'description' },
    { title: '状态', dataIndex: 'description', key: 'description', render: (status: number): React.ReactNode => {
        switch (status) {
            case 1:
                return '已完成';
            case 0:
                return '未完成';
        }
        return <>{status}</>
    } }
]

export default function ProcessDetail(): React.ReactNode {
    const history = useHistory();
    const [form] = Form.useForm();
    const params = useParams<{ id: string, status: string }>();
    const [visible, setVisible] = useState<boolean>(false);
    const [tableDataSource,setTableDataSource] = useState<any>([]);
    const [userDataSource,setUserDataSource] = useState<any>([]);
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        // const data = await RequestUtil.get(`/tower-aps/machining/detail/${params.id}`)
        resole(data)
    }), {})
    const detailData: any = data;
    const delRow = (index: number) => {
        userDataSource.splice(index, 1);
        setUserDataSource([...userDataSource]);
    }
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={params.status!=='3'?[
                <Button key="edit" style={{ marginRight: '10px' }} type="primary" onClick={async () => {
                    setVisible(true)
                }}>数据采集</Button>,
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]:[
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
                <DetailTitle title="部件详情" />
                <BaseInfo columns={baseInfoData} dataSource={detailData?.dispatchVO || {}}/>
                {/* <DetailTitle title="当前进度" />
                <CommonTable 
                    columns={tableColumns}
                    dataSource={tableDataSource} 
                    pagination={false}
                /> */}
            </DetailContent>
            <Modal
                visible={ visible } 
                width="40%" 
                title="采集确认-选择员工"
                footer={ <Space>
                    <Button type="primary" ghost  onClick={() => setVisible(false) }>取消</Button>
                    <Button type="primary" onClick={async () => {
                        await RequestUtil.put(`/tower-aps/machining/collection`,{
                            id:params.id,
                            staffList: userDataSource
                        }).then(()=>{
                            message.success('确认成功！');
                            setVisible(false);
                        }).then(()=>{
                            history.push(`/workshopManagement/processingTask`)
                        })
                    }} disabled={!(userDataSource.length>0)}>确认加工完成</Button>
                </Space> } 
                onCancel={ () => setVisible(false) }
            >
                <WorkshopUserSelectionComponent onSelect={ (selectedRows: object[] | any) => {
                    let temp = [...userDataSource];    
  
                    temp.push(selectedRows[0]);
                    setUserDataSource(temp);
                    } } buttonTitle="添加员工" selectKey={[...userDataSource]}/>
                <Table 
                    columns={[
                        { title: '姓名', dataIndex: 'name', key:'name' },
                        { title: '操作', dataIndex: 'operation', key: 'operation' ,render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                            <Space direction="horizontal" size="small">
                                <Popconfirm
                                    title="确认删除?"
                                    onConfirm={ () => delRow(index) }
                                    okText="确认"
                                    cancelText="取消"
                                >
                                    <Button type="link">删除</Button>
                                </Popconfirm>
                            </Space>
                        ) }
                    ]}
                    dataSource={[...userDataSource]} 
                    pagination={false}
                    size='small'
                />
            </Modal>
        </Spin>
    </>
}