import React, { useState } from 'react'
import { Space, Input, DatePicker,  Button, Modal, Select } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { CommonTable, Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';

export default function SetOutTowerMngt(): React.ReactNode {
    const [visible, setVisible] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState({});
    const history = useHistory();
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'name',
            title: '塔型',
            width: 100,
            dataIndex: 'name'
        },
        {
            key: 'steelProductShape',
            title: '塔型钢印号',
            width: 100,
            dataIndex: 'steelProductShape'
        },
        {
            key: 'pattern',
            title: '模式',
            width: 100,
            dataIndex: 'pattern',
            render: (value: number, record: object): React.ReactNode => {
                const renderEnum: any = [
                  {
                    value: 1,
                    label: "新放"
                  },
                  {
                    value: 2,
                    label: "重新出卡"
                  },
                  {
                    value: 3,
                    label: "套用"
                  },
                ]
                return <>{value&&renderEnum.find((item: any) => item.value === value).label}</>
            }
        },
        {
            key: 'taskNumber',
            title: '任务单编号',
            width: 100,
            dataIndex: 'taskNumber'
        },
        {
            key: 'saleOrderNumber',
            title: '订单编号',
            width: 100,
            dataIndex: 'saleOrderNumber'
        },
        {
            key: 'structureCount',
            title: '件号数',
            width: 100,
            dataIndex: 'structureCount',
            render: (_: number, _b: any, index: number): React.ReactNode => (<span>{_===-1?0:_}</span>)
        },
        {
            key: 'internalNumber',
            title: '内部合同编号',
            width: 100,
            dataIndex: 'internalNumber'
        },
        {
            key: 'steelAngleCount',
            title: '角钢件号数',
            width: 100,
            dataIndex: 'steelAngleCount',
            render: (_: number, _b: any, index: number): React.ReactNode => (<span>{_===-1?0:_}</span>)
        },
        {
            key: 'steelPlateCount',
            title: '钢板件号数',
            width: 100,
            dataIndex: 'steelPlateCount',
            render: (_: number, _b: any, index: number): React.ReactNode => (<span>{_===-1?0:_}</span>)
        },
        {
            key: 'updateUserName',
            title: '最后更新人',
            width: 200,
            dataIndex: 'updateUserName'
        },
        {
            key: 'updateTime',
            title: '最后更新时间',
            width: 200,
            dataIndex: 'updateTime'
        },
        {
            key: 'operation',
            title: '操作',
            fixed: 'right' as FixedType,
            width: 250,
            dataIndex: 'operation',
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type='link' onClick={()=>{history.push(`/setOutTower/setOutTowerMngt/towerDetail/${record.id}`)}}>塔型信息</Button>
                    <Button type='link' onClick={()=>{history.push(`/setOutTower/setOutTowerMngt/towerMember/${record.id}/${record.structureCount===-1?0:record.structureCount}`)}}>塔型构件</Button>
                    <Button type='link' onClick={()=>{history.push(`/setOutTower/setOutTowerMngt/assemblyWeld/${record.id}`)}}>组焊清单</Button>
                    <Button type='link' onClick={()=>{history.push(`/setOutTower/setOutTowerMngt/bolt/${record.id}`)}}>螺栓清单</Button>
                    <Button type='link' onClick={()=>{setVisible(true)}}>附件</Button>
                </Space>
            )
        }
    ]
    const handleModalCancel = () => setVisible(false);
    const onFilterSubmit = (value: any) => {
        if (value.createTime) {
            const formatDate = value.createTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.creationTimeStart = formatDate[0]+ ' 00:00:00';
            value.creationTimeEnd = formatDate[1]+ ' 23:59:59';
            delete value.createTime
        }
        setFilterValue(value)
        return value
    }
    return <>
        <Modal title='附件'  width={1200} visible={visible} onCancel={handleModalCancel} footer={false}>
            <CommonTable columns={[
                { 
                    key: 'index',
                    title: '序号', 
                    dataIndex: 'index',
                    width: 50, 
                    render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
                { 
                    key: 'name', 
                    title: '交付物名称', 
                    dataIndex: 'name',
                    width: 150 
                },
                { 
                    key: 'name', 
                    title: '用途', 
                    dataIndex: 'name',
                    width: 230
                },
                { 
                    key: 'operation', 
                    title: '操作', 
                    dataIndex: 'operation', 
                    render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                        <Button type="link">下载</Button>
                ) }
            ]} dataSource={[]} />
        </Modal>
        <Page
            path="/tower-science/productCategory/lofting/page"
            columns={columns}
            filterValue={filterValue}
            onFilterSubmit={onFilterSubmit}
            extraOperation={<Button type="primary">导出</Button>}
            searchFormItems={[
                {
                    name: 'pattern',
                    label: '类型',
                    children:   <Select style={{width:'100px'}}>
                                    <Select.Option value={''} key={''}>全部</Select.Option>
                                    <Select.Option value={1} key={1}>新放</Select.Option>
                                    <Select.Option value={3} key={3}>套用</Select.Option>
                                    <Select.Option value={2} key={2}>重新出卡</Select.Option>
                                </Select>
                },
                {
                    name: 'createTime',
                    label: '创建时间',
                    children:  <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'fuzzyMsg',
                    label: '模糊查询项',
                    children: <Input placeholder="请输入塔型/塔型钢印号/任务单编号/订单编号/内部合同编号进行查询" maxLength={200} />
                },
            ]}
        />
    </>
}