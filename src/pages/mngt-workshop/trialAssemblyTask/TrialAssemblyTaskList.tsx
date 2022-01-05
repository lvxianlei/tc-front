import React, { useState } from 'react';
import { Space, Input, DatePicker, Select, Button, Modal, Table } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import { Link, useHistory } from 'react-router-dom';
import WorkshopUserModal from '../../../components/WorkshopUserModal';

export default function TrialAssemblyTaskList(): React.ReactNode {
    const [ refresh, setRefresh ] = useState<boolean>(false);
    const [ visible, setVisible ] = useState<boolean>(false);
    const [ filterValue, setFilterValue ] = useState({});
    const [tableUserDataSource, setTableUserDataSource] = useState<any[]>([]);
    const history = useHistory();
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <span>{ index + 1 }</span>
            )
        },
        {
            key: 'name',
            title: '转料状态',
            width: 150,
            dataIndex: 'name',
            render: (status: number): React.ReactNode => {
                switch (status) {
                    case 1:
                        return '已完成';
                    case 2:
                        return '未完成';
                }
                return <>{status}</>
            }
        },
        {
            key: 'steelProductShape',
            title: '试装任务编号',
            dataIndex: 'steelProductShape',
            width: 120
        },
        {
            key: 'saleOrderNumber',
            title: '工程名称',
            dataIndex: 'saleOrderNumber',
            width: 200
        },
        {
            key: 'internalNumber',
            title: '计划号',
            width: 200,
            dataIndex: 'internalNumber'
        },
        {
            key: 'internalNumber',
            title: '塔型',
            width: 200,
            dataIndex: 'internalNumber'
        },
        {
            key: 'structureCount',
            title: '基数',
            width: 200,
            dataIndex: 'structureCount'
        },
        {
            key: 'steelAngleCount',
            title: '构件明细',
            width: 200,
            dataIndex: 'steelAngleCount',
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button 
                        type='link' 
                        onClick={()=>{ 
                            history.push(`/workshopManagement/trialAssemblyTask/componentDetail/${ record.id }` )
                        }}
                    >
                        详情
                    </Button>
                </Space>
            )
        },
        {
            key: 'steelPlateCount',
            title: '开试装时间',
            width: 200,
            dataIndex: 'steelPlateCount',
        },
        {
            key: 'steelPlateCount',
            title: '送齐时间',
            width: 200,
            dataIndex: 'steelPlateCount',
        },
        {
            key: 'description',
            title: '试装重量',
            width: 200,
            dataIndex: 'description',
        },
        {
            key: 'description',
            title: '试装区域',
            width: 200,
            dataIndex: 'description',
        },
        {
            key: 'description',
            title: '运输班组',
            width: 200,
            dataIndex: 'description',
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 80,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button 
                        type='link' 
                        onClick={()=>{
                            setVisible(true)
                        }}
                    >
                        指派
                    </Button>
                </Space>
            )
        }
    ]
    //人员
    const onUserSelect = (selectedRows: any[]): void => {
        if (selectedRows && selectedRows.length > 0) {
            setTableUserDataSource([...tableUserDataSource, selectedRows[0]])
        }
    }
    return <>
        <Page
            path="/tower-science/materialTask"
            columns={ columns }
            headTabs={ [] }
            // extraOperation={ <Button type="primary" ghost>导出</Button> }
            refresh={ refresh }
            searchFormItems={ [
                {
                    name: 'pattern',
                    label: '转料状态',
                    children: <Select style={{ width: '120px' }} placeholder="请选择">
                        <Select.Option value={ "" } key="">全部</Select.Option>
                        <Select.Option value={ 1 } key="1">已完成</Select.Option>
                        <Select.Option value={ 2 } key="2">未完成</Select.Option>
                    </Select>
                },
                {
                    name: 'time',
                    label: '开试装日期',
                    children: <DatePicker.RangePicker />
                },
                {
                    name: 'fuzzyMsg',
                    label: '模糊查询项',
                    children: <Input placeholder="请输入塔型/计划号进行查询"/>
                }
            ] }
            filterValue={ filterValue }
            onFilterSubmit = { (values: Record<string, any>) => {
                if(values.time) {
                    const formatDate = values.time.map((item: any) => item.format("YYYY-MM-DD"));
                    values.creationTimeStart = formatDate[0] + ' 00:00:00';
                    values.creationTimeEnd = formatDate[1] + ' 23:59:59';
                    delete values.time;
                }
                setFilterValue(values);
                return values;
            } }
        />
        <Modal 
            visible={ visible } 
            title="选择人员" 
            onCancel={ () => { 
                setVisible(false); 
                // setRejectReason(""); 
            } } 
            onOk={ () => {
                // if(rejectReason) {
                //     if(/^[^(\s)]*$/.test(rejectReason)) {
                //         RequestUtil.put(`/tower-science/assessTask/reject`, { id: params.id, rejectReason: rejectReason }).then(res => {
                //             setRejectReason("");
                //             setVisible(false); 
                //             message.success('拒绝成功');
                //             history.go(0);
                //         });
                //     } else {
                //         message.warning('禁止输入空格');
                //     }
                // } else {
                //     message.warning('请输入拒绝原因');
                // }     
            } } 
            cancelText="取消" 
            okText="确认指派" 
        >
            <WorkshopUserModal onSelect={onUserSelect} selectKey={tableUserDataSource} />
            <Table 
                columns={[
                    {   
                        title: '姓名', 
                        dataIndex: 'name', 
                        key: 'name' 
                    },
                    {
                        title: '操作', 
                        dataIndex: 'operation', 
                        key: 'operation', 
                        render: (_: any, record: any, index: number) => (
                            <Button type="link" onClick={() => {
                                tableUserDataSource.splice(index, 1);
                                setTableUserDataSource(tableUserDataSource);
                            }}>删除</Button>
                        )
                    }
                ]} 
                dataSource={tableUserDataSource} 
                pagination={false} 
            />
        </Modal>
    </>
}