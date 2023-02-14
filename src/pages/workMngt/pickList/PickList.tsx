import React, { useState } from 'react'
import { Space, Input, DatePicker, Button, Form, Modal, Select } from 'antd'
import { FixedType } from 'rc-table/lib/interface';
import { useHistory, useLocation } from 'react-router-dom';
import { CommonTable, IntgSelect, Page } from '../../common';
import { downloadTemplate } from '../setOut/downloadTemplate';
import { patternTypeOptions } from '../../../configuration/DictionaryOptions';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import styles from './pick.module.less';

export default function PickList(): React.ReactNode {
    const [visible, setVisible] = useState<boolean>(false);
    const history = useHistory();
    const [taskId,setTaskId] = useState('');
    const [filterValue, setFilterValue] = useState({});
    const location = useLocation<{ state?: number, userId?: string }>();
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data:any = await RequestUtil.get(`/tower-system/employee?size=1000`);
        resole(data?.records);
    }), {})
    const user:any = data||[];
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            fixed: "left" as FixedType,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'taskNum',
            title: '提料任务编号',
            width: 100,
            dataIndex: 'taskNum'
        },
        {
            key: 'projectName',
            title: '图纸/工程名称',
            width: 100,
            dataIndex: 'projectName'
        },
        {
            key: 'planNumber',
            title: '计划号',
            width: 100,
            dataIndex: 'planNumber'
        },
        {
            key: 'internalNumber',
            title: '内部合同编号',
            width: 100,
            dataIndex: 'internalNumber'
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
            key: 'materialStandardName',
            title: '标准',
            width: 100,
            dataIndex: 'materialStandardName'
        },
        {
            key: 'num',
            title: '杆塔（基）',
            width: 100,
            dataIndex: 'num'
        },
        {
            key: 'plannedDeliveryTime',
            title: '计划交付时间',
            width: 200,
            dataIndex: 'plannedDeliveryTime'
        },
        {
            key: 'patternName',
            title: '模式',
            width: 100,
            dataIndex: 'patternName',
        },
        {
            key: 'materialLeaderName',
            title: '提料负责人',
            width: 100,
            dataIndex: 'materialLeaderName'
        },
        {
            key: 'materialStatusName',
            title: '塔型提料状态',
            width: 150,
            dataIndex: 'materialStatusName'
        },
        {
            key: 'updateStatusTime',
            title: '最新状态变更时间',
            width: 150,
            dataIndex: 'updateStatusTime'
        },
        {
            key: 'operation',
            title: '操作',
            fixed: 'right' as FixedType,
            width: 200,
            dataIndex: 'operation',
            render: (_: undefined, record: any): React.ReactNode => (
                <Space size="small" className={styles.operationBtn}>
                    <Button type='link' onClick={() =>{history.push(`/workMngt/pickList/pickMessage/${record.id}`)}}>提料信息</Button>
                    <Button type='link' onClick={() =>{history.push(`/workMngt/pickList/pickTowerMessage/${record.id}/${record.materialStatus}/${record.materialLeader}`)}}>塔型信息</Button>
                    <Button type='link' onClick={() =>{history.push(`/workMngt/pickList/pickTower/${record.id}/${record.materialStatus}`)}} >杆塔配段</Button>
                    <Button type='link' onClick={() =>{setTaskId(record.id); setVisible(true)}} disabled={record.materialStatus<3} >交付物</Button>
                </Space>
            )
        }
    ]

    const handleModalCancel = () => {setVisible(false);setTaskId('')};
    const onFilterSubmit = (value: any) => {
        if (value.statusUpdateTime) {
            const formatDate = value.statusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.updateStatusTimeStart = formatDate[0]+ ' 00:00:00';
            value.updateStatusTimeEnd = formatDate[1]+ ' 23:59:59';
            delete value.statusUpdateTime
        }
        if (value.planTime) {
            const formatDate = value.planTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.plannedDeliveryTimeStart = formatDate[0]+ ' 00:00:00';
            value.plannedDeliveryTimeEnd = formatDate[1]+ ' 23:59:59';
            delete value.planTime
        }
        if (value.materialLeader) {
            value.materialLeader = value.materialLeader?.value;
        }
        setFilterValue(value)
        return value
    }
    return (
        <>
            <Modal title='交付物清单'  width={1200} visible={visible} onCancel={handleModalCancel} footer={false}>
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
                        key: 'function', 
                        title: '用途', 
                        dataIndex: 'function',
                        width: 230
                    },
                    { 
                        key: 'operation', 
                        title: '操作', 
                        width: 50, 
                        dataIndex: 'operation', 
                        render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                            <Button type="link" onClick={() => downloadTemplate(record.path,record.downName)}>下载</Button>
                    ) }
                ]} dataSource={[{
                        name:'塔型名称构件明细.excel',
                        downName: "塔型名称构件明细",
                        function:'提料塔型构件明细',
                        path:`/tower-science/materialProductCategory/material/productCategoryStructure/download/excel?productCategoryId=${taskId}`
                    },{
                        name:'杆塔构件明细汇总表.excel',
                        downName: "杆塔构件明细汇总表",
                        function:'提料杆塔构件明细汇总',
                        path: `/tower-science/materialProductCategory/material/productStructure/download/excel?productCategoryId=${taskId}`
                }]} />
            </Modal>
            <Page
                path="/tower-science/materialProductCategory"
                columns={columns}
                filterValue={filterValue}
                onFilterSubmit={onFilterSubmit}
                exportPath="/tower-science/materialProductCategory"
                requestData={ { status: location.state?.state, materialLeader: location.state?.userId } }
                searchFormItems={[
                    {
                        name: 'statusUpdateTime',
                        label: '最新状态变更时间',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                    },
                    {
                        name: 'materialStatus',
                        label: '塔型状态',
                        children: <Form.Item name="materialStatus" initialValue={ location.state?.state||'' }>
                            <Select style={{width:'100px'}}>
                                <Select.Option value={''} key ={''}>全部</Select.Option>
                                <Select.Option value={1} key={1}>待指派</Select.Option>
                                <Select.Option value={2} key={2}>提料中</Select.Option>
                                {/* <Select.Option value={3} key={3}>配段中</Select.Option> */}
                                <Select.Option value={3} key={3}>已完成</Select.Option>
                            </Select>
                        </Form.Item>
                    },
                    {
                        name: 'materialLeader',
                        label: '提料负责人',
                        children: <IntgSelect width={200} />
                    },
                    {
                        name: 'pattern',
                        label: '模式',
                        children: <Select style={{ width: '150px' }} getPopupContainer={triggerNode => triggerNode.parentNode}>
                            { patternTypeOptions && patternTypeOptions.map(({ id, name }, index) => {
                                return <Select.Option key={ index } value={ id }>
                                    { name }
                                </Select.Option>
                            }) }
                        </Select>
                    },
                    {
                        name: 'fuzzyMsg',
                        label: '模糊查询项',
                        children: <Input style={{ width: '300px' }} placeholder="提料任务编号/计划号/订单编号/内部合同编号/塔型/塔型钢印号" maxLength={200} />
                    },
                ]}
            />
        </>
    )
}