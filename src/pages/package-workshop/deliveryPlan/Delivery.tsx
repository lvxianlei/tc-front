import React, { useState } from 'react'
import { Button, Form, Input, message, Space, Spin, Table, Tabs } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { BaseInfo, DetailContent, CommonTable, DetailTitle } from '../../common';
import { baseInfoData } from './deliveryTaskData.json';
import WorkshopUserModal from '../../../components/WorkshopUserModal';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';

const tableColumns = [
    { title: '产品名称', dataIndex: 'createUserName', key: 'createUserName' },
    { title: '包名称', dataIndex: 'createTime', key: 'createTime' },
    { title: '塔型', dataIndex: 'currentStatus', key: 'currentStatus' },
    { title: '塔位号', dataIndex: 'currentStatus', key: 'currentStatus' },
    { title: '呼高', dataIndex: 'currentStatus', key: 'currentStatus' },
    { title: '基数', dataIndex: 'description', key: 'description' },
    { title: '班组', dataIndex: 'description', key: 'description' },
]


export default function ConfirmTaskDetail(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string }>();
    const [dataSource, setDataSource] = useState<[]>([]);
    const [activeKey, setActiveKey] = useState<string>('');
    const [selectedKeys, setSelectKeys] = useState<any[]>([]);
    const [selectedRows, setSelectRows] = useState<any[]>([]);
    const [tableDataSource, setTableDataSource] = useState([]);
    const [tableUserDataSource, setTableUserDataSource] = useState<any[]>([]);
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/drawTask/getDrawTaskById?drawTaskId=${params.id}`)
        resole(data)
    }), {})
    const getDataSource = async (basicHeightId?: string) => {
        const data: [] = await RequestUtil.get(`/tower-science/boltRecord/checkList`, {
            basicHeightId: basicHeightId,
            productCategoryId: params.id
        })
        setDataSource(data);
    }

    const detailData: any = data || [];

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
                            console.log(selectedRows)
                            if(tableUserDataSource.length>0){
                                console.log(tableUserDataSource)
                                RequestUtil.post(``,{}).then(()=>{
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
                        <Form layout="inline" onFinish={async (value: any) => {
                            const tableDataSource: any = await RequestUtil.get(``, value);
                            setTableDataSource(tableDataSource)
                        }} style={{ margin: '10px' }}>
                            <Form.Item label='班组'>
                                <Input />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">查询</Button>
                            </Form.Item>
                        </Form>
                        <DetailTitle title="杆塔信息" />
                        <Table
                            dataSource={tableDataSource}
                            columns={tableColumns}
                            rowKey='id'
                            rowSelection={{
                                type: 'checkbox',
                                onChange: (selectedKeys: React.Key[], selectedRows: any) => {
                                    setSelectKeys(selectedKeys);
                                    setSelectRows(selectedRows);
                                }
                            }}
                        />
                        <DetailTitle title="发包人员" operation={[<WorkshopUserModal onSelect={onUserSelect} saleOrderId={''} selectKey={tableUserDataSource} />]} />
                        <CommonTable columns={[
                            { title: '姓名', dataIndex: 'name', key: 'name' },
                            {
                                title: '操作', dataIndex: 'operation', key: 'operation', render: (_: any, record: any, index: number) => (<>
                                    <Button type="link" onClick={() => {
                                        tableUserDataSource.splice(index, 1);
                                        setTableUserDataSource(tableUserDataSource);
                                    }}>删除</Button>
                                </>)
                            }
                        ]} dataSource={tableUserDataSource} pagination={false} />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={`已出库`} key={2}>
                        <CommonTable columns={[...tableColumns, { title: '发包人员', dataIndex: 'description', key: 'description' }]} dataSource={[]} pagination={false} />
                    </Tabs.TabPane>
                </Tabs>
            </DetailContent>
        </Spin>
    </>
}