import React, { useState } from 'react'
import { Space, Input, DatePicker, Button, Select, TreeSelect, Form } from 'antd'
import { useHistory, useLocation } from 'react-router-dom'
import { FixedType } from 'rc-table/lib/interface';
import { Page } from '../../common'
import { TreeNode } from 'antd/lib/tree-select';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import styles from './confirm.module.less';
import AuthUtil from '../../../utils/AuthUtil';

export default function ConfirmList(): React.ReactNode {
    const [confirmLeader, setConfirmLeader] = useState<any | undefined>([]);
    const [department, setDepartment] = useState<any | undefined>([]);
    const [filterValue, setFilterValue] = useState({});
    const location = useLocation<{ state: number }>();
    const history = useHistory();
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const departmentData: any = await RequestUtil.get(`/sinzetech-user/department/tree`);
        setDepartment(departmentData);
        resole(data)
    }), {})
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'taskNum',
            title: '确认任务编号',
            width: 100,
            dataIndex: 'taskNum'
        },
        {
            key: 'contractName',
            title: '合同名称',
            width: 100,
            dataIndex: 'contractName'
        },
        {
            key: 'plannedDeliveryTime',
            title: '计划交付时间',
            width: 200,
            dataIndex: 'plannedDeliveryTime'
        },
        {
            key: 'confirmName',
            title: '确认人',
            width: 200,
            dataIndex: 'confirmName'
        },
        {
            key: 'statusName',
            title: '状态',
            width: 200,
            dataIndex: 'statusName'
        },
        // {
        //     key: 'status',
        //     title: '状态',
        //     width: 100,
        //     dataIndex: 'status',
        //     render: (value: number, record: object): React.ReactNode => {
        //         const renderEnum: any = [
        //             {
        //                 value: 0,
        //                 label: "已拒绝"
        //             },
        //             {
        //                 value: 1,
        //                 label: "待确认"
        //             },
        //             {
        //                 value: 2,
        //                 label: "待指派"
        //             },
        //             {
        //                 value: 3,
        //                 label: "待完成"
        //             },
        //             {
        //                 value: 4,
        //                 label: "已完成"
        //             },
        //             {
        //                 value: 5,
        //                 label: "已提交"
        //             }
        //         ]
        //         return <>{renderEnum.find((item: any) => item.value === value).label}</>
        //     }
        // },
        {
            key: 'updateStatusTime',
            title: '状态时间',
            width: 200,
            dataIndex: 'updateStatusTime'
        },
        {
            key: 'operation',
            title: '操作',
            fixed: 'right' as FixedType,
            width: 150,
            dataIndex: 'operation',
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type='link' onClick={() => { history.push(`/workMngt/confirmList/confirmMessage/${record.id}`) }} disabled={AuthUtil.getUserId() !== record.confirmId}>确认信息</Button>
                    <Button type='link' onClick={() => { history.push(`/workMngt/confirmList/confirmDetail/${record.id}/${record.status}`) }} disabled={record.status < 3 || AuthUtil.getUserId() !== record.confirmId}>确认明细</Button>
                </Space>
            )
        }
    ];
    const onDepartmentChange = async (value: Record<string, any>) => {
        if (value) {
            const userData: any = await RequestUtil.get(`/sinzetech-user/user?departmentId=${value}&size=1000`);
            setConfirmLeader(userData.records);
        } else {

            setConfirmLeader([]);
        }

    }
    const renderTreeNodes = (data: any) =>
        data.map((item: any) => {
            if (item.children) {
                item.disabled = true;
                return (
                    <TreeNode key={item.id} title={item.title} value={item.id} disabled={item.disabled} className={styles.node}>
                        {renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} key={item.id} title={item.title} value={item.id} />;
        });
    const wrapRole2DataNode = (roles: (any & SelectDataNode)[] = []): SelectDataNode[] => {
        roles.forEach((role: any & SelectDataNode): void => {
            role.value = role.id;
            role.isLeaf = false;
            if (role.children && role.children.length > 0) {
                wrapRole2DataNode(role.children);
            }
        });
        return roles;
    }
    const onFilterSubmit = (value: any) => {
        if (value.planTime) {
            const formatDate = value.planTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.plannedDeliveryTimeStart = formatDate[0] + ' 00:00:00';
            value.plannedDeliveryTimeEnd = formatDate[1] + ' 23:59:59';
            delete value.planTime
        }
        setFilterValue(value)
        return value
    }
    return (
        <Page
            path="/tower-science/drawProductDetail"
            columns={columns}
            filterValue={filterValue}
            exportPath="/tower-science/drawProductDetail"
            // extraOperation={<Button type="primary">导出</Button>}
            onFilterSubmit={onFilterSubmit}
            requestData={{ status: location.state }}
            searchFormItems={[
                {
                    name: 'status',
                    label: '任务状态',
                    children: <Form.Item name="status" initialValue={location.state}>
                        <Select style={{ width: "100px" }}>
                            {/* <Select.Option value={1} key={1}>待确认</Select.Option>
                            <Select.Option value={2} key={2}>待指派</Select.Option> */}
                            <Select.Option value={''} key={''}>全部</Select.Option>
                            <Select.Option value={3} key={3}>待完成</Select.Option>
                            <Select.Option value={4} key={4}>已完成</Select.Option>
                            {/* <Select.Option value={5} key={5}>已提交</Select.Option>
                            <Select.Option value={0} key={0}>已拒绝</Select.Option> */}
                        </Select>
                    </Form.Item>
                },
                {
                    name: 'planTime',
                    label: '计划交付时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'confirmDept',
                    label: '确认人',
                    children: <TreeSelect style={{ width: '200px' }}
                        allowClear
                        onChange={onDepartmentChange}
                    >
                        {renderTreeNodes(wrapRole2DataNode(department))}
                    </TreeSelect>
                },
                {
                    name: 'confirmId',
                    label: '',
                    children: <Select style={{ width: '100px' }} allowClear>
                        {confirmLeader && confirmLeader.map((item: any) => {
                            return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                        })}
                    </Select>
                },
                {
                    name: 'fuzzyQueryItem',
                    label: '模糊查询项',
                    children: <Input placeholder="请输入任务编号/合同名称进行查询" maxLength={200} />
                },
            ]}
        />
    )
}