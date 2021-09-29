import React from 'react';
import { Space, Input, DatePicker, Select, Button, Popconfirm, Form, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import { Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import AssessmentInformation from './AssessmentInformation';
import styles from './AssessmentTask.module.less';
import Assign from './Assign';
import RequestUtil from '../../utils/RequestUtil';

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
        key: 'status',
        title: '任务状态',
        dataIndex: 'status',
        width: 120
    },
    {
        key: 'updateStatusTime',
        title: '最新状态变更时间',
        width: 200,
        dataIndex: 'updateStatusTime'
    },
    {
        key: 'assessUserName',
        title: '评估人',
        width: 150,
        dataIndex: 'assessUserName'
    },
    {
        key: 'programName',
        title: '项目名称',
        dataIndex: 'programName',
        width: 200
    },
    {
        key: 'customer',
        title: '客户名称',
        dataIndex: 'customer',
        width: 200
    },
    {
        key: 'programLeaderName',
        title: '项目负责人',
        dataIndex: 'programLeaderName',
        width: 150
    },
    {
        key: 'bidEndTime',
        title: '投标截止时间',
        dataIndex: 'bidEndTime',
        width: 200
    },
    {
        key: 'operation',
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right' as FixedType,
        width: 230,
        render: (_: undefined, record: Record<string, any>): React.ReactNode => (
            <Space direction="horizontal" size="small" className={ styles.operationBtn }>
                <Link to={ `/assessmentTask/assessmentTaskDetail/${ record.id }` }>任务详情</Link>
                <Assign id={ record.id } />
                <AssessmentInformation id={ record.id } />
                <Popconfirm
                    title="确认提交?"
                    onConfirm={ () => {
                        RequestUtil.put(`/tower-science/assessTask/submit`, { id: record.id });
                    } }
                    okText="提交"
                    cancelText="取消"
                >
                    <Button type="link">提交任务</Button>
                </Popconfirm>
            </Space>
        )
    }
]

export default function AssessmentTaskList(): React.ReactNode {
    return <Page
        path="/tower-science/assessTask"
        columns={ columns }
        headTabs={ [] }
        extraOperation={ <Button type="primary" ghost>导出</Button> }
        searchFormItems={ [
            {
                name: 'fuzzyMsg',
                label: '模糊查询项',
                children: <Input placeholder="任务编号/项目名称/客户名称"/>
            },
            {
                name: 'updateStatusTime',
                label: '最新状态变更时间',
                children: <DatePicker.RangePicker />
            },
            {
                name: 'status',
                label: '任务状态',
                children: <Select style={{ width: '120px' }}>
                    <Select.Option value="0" key="0">已拒绝</Select.Option>
                    <Select.Option value="1" key="1">待确认</Select.Option>
                    <Select.Option value="2" key="2">待指派</Select.Option>
                    <Select.Option value="3" key="3">待完成</Select.Option>
                    <Select.Option value="4" key="4">已完成</Select.Option>
                    <Select.Option value="5" key="5">已提交</Select.Option>
                </Select>
            },
            {
                name: 'programLeaderId',
                label: '项目负责人',
                children: <>
                    <Col>
                        <Form.Item name="programLeaderIdDept">
                            <Select style={{ width: '120px' }}>
                                <Select.Option value="0" key="0">已拒绝</Select.Option>
                                <Select.Option value="1" key="1">待确认</Select.Option>
                                <Select.Option value="2" key="2">待指派</Select.Option>
                                <Select.Option value="3" key="3">待完成</Select.Option>
                                <Select.Option value="4" key="4">已完成</Select.Option>
                                <Select.Option value="5" key="5">已提交</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item name="programLeaderId">
                            <Input />
                        </Form.Item>
                    </Col>
                </>
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
                                <Select.Option value="2" key="2">待指派</Select.Option>
                                <Select.Option value="3" key="3">待完成</Select.Option>
                                <Select.Option value="4" key="4">已完成</Select.Option>
                                <Select.Option value="5" key="5">已提交</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item name="assessUser">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
            },
            {
                name: 'bidEndTime',
                label: '投标截止时间',
                children: <DatePicker />
            }
        ] }
        onFilterSubmit = { (values: Record<string, any>) => {
            if(values.updateStatusTime) {
                const formatDate = values.updateStatusTime.map((item: any) => item.format("YYYY-MM-DD"));
                values.updateStatusTimeStart = formatDate[0];
                values.updateStatusTimeEnd = formatDate[1];
            }
            if(values.bidEndTimeStart) {
                const formatDate = values.bidEndTimeStart.map((item: any) => item.format("YYYY-MM-DD"));
                values.bidEndTimeStartStart = formatDate[0];
                values.bidEndTimeStartEnd = formatDate[1];
            }
            return values;
        } }
    />
}