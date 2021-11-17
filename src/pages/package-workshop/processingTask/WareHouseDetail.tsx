import React, { useState } from 'react'
import { Button, Form, message, Modal, Popconfirm, Space, Spin, Table } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { BaseInfo, DetailContent, CommonTable, DetailTitle } from '../../common';
import { baseInfoData } from './detail.json';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import WorkshopUserSelectionComponent from '../../../components/WorkshopUserModal';



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
        { title: '杆塔号', dataIndex: 'createDeptName', key: 'createDeptName', },
        { title: '呼高', dataIndex: 'createUserName', key: 'createUserName' },
        { title: '入库重量', dataIndex: 'createTime', key: 'createTime' },
        { title: '总基数', dataIndex: 'description', key: 'description' },
        { title: '入库基数', dataIndex: 'operation', key: 'operation'}
    ]
    const packageColumns = [
        { title: '捆号/包号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
        { title: '包类型', dataIndex: 'createDeptName', key: 'createDeptName', },
        { title: '重量', dataIndex: 'createUserName', key: 'createUserName' },
        { title: '入库数', dataIndex: 'createTime', key: 'createTime' },
        { title: '区位', dataIndex: 'description', key: 'description' }
    ]
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={params.status!=='3'?[
                <Button key="edit" style={{ marginRight: '10px' }} type="primary" onClick={async () => {
                    setVisible(true)
                }}>确认入库</Button>,
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]:[
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
                <DetailTitle title="基本信息" />
                <Form form={form}>
                </Form>
                <DetailTitle title="杆塔明细" />
                <CommonTable 
                    columns={tableColumns}
                    dataSource={tableDataSource} 
                    pagination={false}
                />
                <DetailTitle title="包信息" />
                <CommonTable 
                    columns={packageColumns}
                    dataSource={tableDataSource} 
                    pagination={false}
                />
            </DetailContent>
            <Modal
                visible={ visible } 
                width="40%" 
                title="采集确认-选择员工"
                footer={ <Space>
                    <Button type="primary" ghost  onClick={() => setVisible(false) }>取消</Button>
                    <Button type="primary" onClick={async () => {
                        await RequestUtil.get(``,{}).then(()=>{
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
                    } } buttonTitle="添加员工"/>
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
                />
            </Modal>
        </Spin>
    </>
}