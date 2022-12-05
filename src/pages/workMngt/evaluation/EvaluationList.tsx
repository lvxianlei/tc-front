import React, { useState } from 'react';
import { Space, Input, DatePicker, Select, Form, Button } from 'antd';
import { IntgSelect, Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './Evaluation.module.less';
import EvaluationInformation from './EvaluationInformation';
import RequestUtil from '../../../utils/RequestUtil';
import { TreeNode } from 'antd/lib/tree-select';
import useRequest from '@ahooksjs/use-request';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import AuthUtil from '../../../utils/AuthUtil';
import { useLocation } from 'react-router-dom';

export default function EvaluationList(): React.ReactNode {
    const [refresh, setRefresh] = useState(false);
    const location = useLocation<{ state?: number, userId?: string }>();

    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'taskCode',
            title: '评估任务编号',
            width: 150,
            dataIndex: 'taskCode'
        },
        {
            key: 'programName',
            title: '项目名称',
            dataIndex: 'programName',
            width: 120
        },
        {
            key: 'expectDeliverTime',
            title: '计划交付时间',
            width: 200,
            dataIndex: 'expectDeliverTime'
        },
        {
            key: 'assessUserName',
            title: '评估人',
            width: 150,
            dataIndex: 'assessUserName'
        },
        {
            key: 'statusName',
            title: '状态',
            dataIndex: 'statusName',
            width: 200
        },
        {
            key: 'updateStatusTime',
            title: '最新状态变更时间',
            width: 200,
            dataIndex: 'updateStatusTime'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 150,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={styles.operationBtn}>
                    {
                        AuthUtil.getUserInfo().user_id !== record.assessUser ? <Button type="link" disabled>评估信息</Button>
                            : <EvaluationInformation id={record.id} updateList={() => setRefresh(!refresh)} />
                    }
                </Space>
            )
        }
    ]

    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-system/employee?size=1000`);
        resole(data);
    }), {})
    const programLeader: any = data?.records || [];
    const [filterValue, setFilterValue] = useState({});

    const wrapRole2DataNode = (roles: (any & SelectDataNode)[] = []): SelectDataNode[] => {
        roles && roles.forEach((role: any & SelectDataNode): void => {
            role.value = role.id;
            role.isLeaf = false;
            if (role.children && role.children.length > 0) {
                wrapRole2DataNode(role.children);
            } else {
                role.children = []
            }
        });
        return roles;
    }

    const renderTreeNodes = (data: any) => data.map((item: any) => {
        if (item.children) {
            return (<TreeNode key={item.id} title={item.title} value={item.id} className={styles.node} >
                {renderTreeNodes(item.children)}
            </TreeNode>);
        }
        return <TreeNode {...item} key={item.id} title={item.title} value={item.id} />;
    });

    return <Page
        path="/tower-science/assessTask/assessList"
        columns={columns}
        headTabs={[]}
        exportPath={`/tower-science/assessTask/assessList`}
        refresh={refresh}
        requestData={{ status: location.state?.state, assessUser: location.state?.userId }}
        searchFormItems={[
            {
                name: 'status',
                label: '任务状态',
                children: <Form.Item name="status" initialValue={location.state?.state}>
                    <Select style={{ width: '120px' }} placeholder="请选择">
                        <Select.Option value="" key="2">全部</Select.Option>
                        <Select.Option value={3} key="3">待完成</Select.Option>
                        <Select.Option value={4} key="4">已完成</Select.Option>
                    </Select>
                </Form.Item>
            },
            {
                name: 'expectDeliverTimeAll',
                label: '计划交付时间',
                children: <DatePicker.RangePicker />
            },
            {
                name: 'assessUser',
                label: '评估人',
                children: <IntgSelect width={200} />
            },
            {
                name: 'fuzzyMsg',
                label: '模糊查询项',
                children: <Input placeholder="任务编号/项目名称" />
            }
        ]}
        filterValue={filterValue}
        onFilterSubmit={(values: Record<string, any>) => {
            if (values.expectDeliverTimeAll) {
                const formatDate = values.expectDeliverTimeAll.map((item: any) => item.format("YYYY-MM-DD"));
                values.expectDeliverTimeStart = formatDate[0] + ' 00:00:00';
                values.expectDeliverTimeEnd = formatDate[1] + ' 23:59:59';
            }
            if (values.assessUser) {
                values.assessUser = values.assessUser?.value;
            }
            setFilterValue(values);
            return values;
        }}
    />
}