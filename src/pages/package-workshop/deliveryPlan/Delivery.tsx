import React, { useState } from 'react'
import { Button, Form, Input, message, Space, Spin, Table, Tabs } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle } from '../../common';
import WorkshopUserModal from '../../../components/WorkshopUserModal';
import RequestUtil from '../../../utils/RequestUtil';
import WorkshopTeamSelectionComponent, { IUser } from '../../../components/WorkshopTeamModal';
import { useForm } from 'antd/lib/form/Form';

const tableColumns = [
    { 
        title: '产品名称', 
        dataIndex: 'productTypeName', 
        key: 'productTypeName' 
    },
    { 
        title: '包名称', 
        dataIndex: 'balesCode', 
        key: 'balesCode' 
    },
    { 
        title: '塔型', 
        dataIndex: 'productCategoryName', 
        key: 'productCategoryName' 
    },
    { 
        title: '塔位号', 
        dataIndex: 'productNumber', 
        key: 'productNumber' 
    },
    { 
        title: '呼高', 
        dataIndex: 'productHeight', 
        key: 'productHeight' 
    },
    { 
        title: '基数', 
        dataIndex: 'number', 
        key: 'number' 
    },
    { 
        title: '班组', 
        dataIndex: 'teamName', 
        key: 'teamName' 
    },
]


export default function Delivery(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string, planNumber: string }>();
    const [form] = useForm();
    const [show, setShow] = useState<boolean>(false);
    const [activeKey, setActiveKey] = useState<string>('');
    const [selectedKeys, setSelectKeys] = useState<any[]>([]);
    const [selectedRows, setSelectRows] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any>([]);
    const [tableDataSource, setTableDataSource] = useState([]);
    const [tableUserDataSource, setTableUserDataSource] = useState<any[]>([]);
    const getDataSource = async (basicHeightId?: string,teamId?: string) => {
        const data: any = await RequestUtil.get(`/tower-production/packageWorkshop/exWarehouseProduct`, {
            status: basicHeightId,
            taskId: params.id,
            planNumber: params.planNumber,
            teamId: teamId
        })
        setTableDataSource(data);
    }
    
    const tabChange = (activeKey: string) => {
        getDataSource(activeKey);
        setActiveKey(activeKey);
    }
    //人员
    const onUserSelect = (selectedRows: any[]): void => {
        if (selectedRows && selectedRows.length > 0) {
            setTableUserDataSource([...tableUserDataSource, selectedRows[0]])
        }
    }
    return <>
        <Spin spinning={false}>
            <DetailContent operation={[
                <Space>
                    <Button type='primary' onClick={() => {
                        if(selectedRows.length>0){
                            if(tableUserDataSource.length>0){
                                RequestUtil.put(`tower-production/packageWorkshop/confirmOutWarehouse`,{
                                    id:params.id,
                                    teamId: selectedUser.id,
                                    teamName: selectedUser.name,
                                    packageUserDTOList: tableUserDataSource,
                                    packageExProductDTOList: selectedRows
                                }).then(()=>{
                                    message.success('出库成功！')
                                }).then(()=>{
                                    history.push(`/packagingWorkshop/deliveryPlan`);
                                })
                            }else{
                                message.error('未选择发包人员，不可出库！')
                            }
                        }else{
                            message.error('未选择杆塔信息，不可出库！')
                        }
                    }}>确认出库</Button>
                    <Button key="goback" onClick={() => history.goBack()}>返回</Button>
                </Space>
            ]}>
                <DetailTitle title="成品出库" />
                <Tabs onChange={tabChange} type="card">
                    <Tabs.TabPane tab={`未出库`} key={1}>
                        <Form layout="inline"  form={ form } onFinish={async (value: any) => {
                            getDataSource('1',selectedUser.id);
                            const tableUserDataSource: any = await RequestUtil.get(`/tower-production/team?id=${ selectedUser.id }`);
                            // setTableDataSource(tableDataSource)
                            setTableUserDataSource(tableUserDataSource?.teamUserVOList);
                            setShow(true)
                        }} style={{ margin: '10px' }}>
                            <Form.Item label='班组' name='teamName' rules={[{required:true,message:'请选择班组'}]}>
                                <Input 
                                    disabled
                                    addonAfter={<WorkshopTeamSelectionComponent onSelect={ (selectedRows: IUser[] | any) => {
                                        setSelectedUser(selectedRows[0]);
                                        form.setFieldsValue({
                                            teamName: selectedRows[0].name
                                        })
                                        setShow(false)
                                    } } buttonType="link" buttonTitle="+选择班组" />}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">查询</Button>
                            </Form.Item>
                            <Form.Item>
                                <Button onClick={()=>{
                                    form.setFieldsValue({
                                        teamName:''
                                    })
                                    setTableDataSource([]);
                                    setSelectRows([]);
                                    setSelectKeys([]);
                                    setSelectedUser([]);
                                    setTableUserDataSource([]);
                                    setShow(false)
                                }}>重置</Button>
                            </Form.Item>
                        </Form>
                        {show&&<>
                            <DetailTitle title="杆塔信息" />
                            <CommonTable
                                dataSource={[...tableDataSource]}
                                columns={tableColumns}
                                rowKey='id'
                                pagination={false}
                                size='small'
                                rowSelection={{
                                    type: 'checkbox',
                                    onChange: (selectedKeys: React.Key[], selectedRows: any) => {
                                        setSelectKeys(selectedKeys);
                                        setSelectRows(selectedRows);
                                    }
                                }}
                            />
                            <DetailTitle 
                                title="发包人员" 
                                operation={[
                                    <WorkshopUserModal 
                                        onSelect={onUserSelect} 
                                        selectKey={tableUserDataSource}  
                                        saleOrderId={selectedUser?.id}
                                    />
                                ]}
                            />
                            <CommonTable 
                                columns={[
                                    { 
                                        title: '姓名', 
                                        dataIndex: 'name', 
                                        key: 'name', 
                                        width:'50%'
                                    },
                                    {
                                        title: '操作', 
                                        dataIndex: 'operation', 
                                        key: 'operation', 
                                        render: (_: any, record: any, index: number) => (
                                            <>
                                                <Button type="link" onClick={() => {
                                                    tableUserDataSource.splice(index, 1);
                                                    console.log(tableUserDataSource)
                                                    setTableUserDataSource([...tableUserDataSource]);
                                                    console.log(tableUserDataSource)
                                                }}>删除</Button>
                                            </>
                                        )
                                    }
                                ]} 
                                dataSource={[...tableUserDataSource]} 
                                pagination={false} 
                                rowKey={'id'} 
                                size='small'
                                />
                            </>
                        }
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={`已出库`} key={2}>
                        <DetailTitle title="杆塔信息" />
                        <CommonTable columns={[...tableColumns, { title: '发包人员', dataIndex: 'userNames', key: 'userNames' }]} dataSource={tableDataSource} pagination={false} />
                    </Tabs.TabPane>
                </Tabs>
            </DetailContent>
        </Spin>
    </>
}