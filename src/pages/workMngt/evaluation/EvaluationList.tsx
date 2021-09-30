import React from 'react';
import { Space, Input, DatePicker, Select, Button, Row, Col, Form } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './Evaluation.module.less';
import EvaluationInformation from './EvaluationInformation';

const columns = [
    {
        key: 'index',
        title: '序号',
        dataIndex: 'index',
        width: 50,
        render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{ index + 1 }</span>)
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
        key: 'assessUser',
        title: '评估人',
        width: 150,
        dataIndex: 'assessUser'
    },
    {
        key: 'status',
        title: '状态',
        dataIndex: 'status',
        width: 200,
        render: (status: string): React.ReactNode => {
            switch (status) {
                case '0':
                    return '已拒绝';
                case "1":
                    return '待接收';
                case '2':
                    return '待指派';
                case '3':
                    return '待完成';
                case '4':
                    return '已完成';
                case '5':
                    return '已提交';
            }
        }
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
            <Space direction="horizontal" size="small" className={ styles.operationBtn }>
                <EvaluationInformation id={ record.id }/>
            </Space>
        )
    }
]

export default function EvaluationList(): React.ReactNode {
    return <Page
        path="/tower-science/assessList"
        columns={ columns }
        headTabs={ [] }
        extraOperation={ <Button type="primary" ghost>导出</Button> }
        searchFormItems={ [
            {
                name: 'startReleaseDate',
                label: '模糊查询项',
                children: <Input placeholder="任务编号/项目名称"/>
            },
            {
                name: 'status',
                label: '任务状态',
                children: <Select style={{ width: '120px' }}>
                    <Select.Option value="3" key="3">待完成</Select.Option>
                    <Select.Option value="4" key="4">已完成</Select.Option>
                </Select>
            },
            {
                name: 'expectDeliverTime',
                label: '计划交付时间',
                children: <DatePicker />
            },
            {
                name: 'startReleaseDate',
                label: '评估人',
                children: <Row>
                    <Col>
                        <Form.Item name="assessUserDept">
                            <Select style={{ width: '120px' }}>
                                <Select.Option value="0" key="0">已拒绝</Select.Option>
                                <Select.Option value="1" key="1">待确认</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item name="assessUser">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
            }
        ] }
        onFilterSubmit = { (values: Record<string, any>) => {
            if(values.expectDeliverTime) {
                values.expectDeliverTime = values.expectDeliverTime.format("YYYY-MM-DD");
            }
            return values;
        } }
    />
}