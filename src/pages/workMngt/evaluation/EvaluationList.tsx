import React, { useRef, useState } from 'react';
import { Space, Input, DatePicker, Select, Form, Button, Modal, message } from 'antd';
import { IntgSelect, Page, SearchTable } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './Evaluation.module.less';
import EvaluationInformation from './EvaluationInformation';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import AuthUtil from '../../../utils/AuthUtil';
import { useHistory, useLocation } from 'react-router-dom';

export interface modalProps {
    onSubmit: () => void;
    onSave: () => void;
    resetFields: () => void
}

export default function EvaluationList(): React.ReactNode {
    const location = useLocation<{ state?: number, userId?: string }>();
    const [visible, setVisible] = useState<boolean>(false);
    const editRef = useRef<modalProps>();
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
    const [rowId, setRowId] = useState('');
    const history = useHistory()

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
                    <Button type="link" disabled={AuthUtil.getUserInfo().user_id !== record.assessUser} onClick={() => {
                        setRowId(record?.id)
                        setVisible(true);
                    }}>评估信息</Button>
                </Space>
            )
        }
    ]

    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-system/employee?size=1000`);
        resole(data);
    }), {})
    const [filterValue, setFilterValue] = useState({});

    
    const handleModalOk = () => new Promise(async (resove, reject) => {
        try {
            await editRef.current?.onSave();
            message.success('评估信息保存成功！');
            resove(true);
            setVisible(false);
            history?.go(0);
        } catch (error) {
            reject(false)
        }
    })
        
    const handleModalSubmit = () => new Promise(async (resove, reject) => {
        try {
            await editRef.current?.onSubmit();
            message.success('评估信息保存并提交成功！');
            resove(true);
            setVisible(false);
            history?.go(0);
        } catch (error) {
            reject(false)
        }
    })

    return <>
            <Modal
            destroyOnClose
            key='EvaluationInformation'
            visible={visible}
            width="40%"
            title={"评估信息"}
            footer={
                <Space>
                    <Button type="ghost" onClick={async () => {
                        setVisible(false);
                        editRef.current?.resetFields()
                    }}>关闭</Button>
                    <Button type="primary" loading={confirmLoading} onClick={handleModalOk} ghost>保存</Button>
                    <Button type="primary" loading={confirmLoading} onClick={handleModalSubmit} ghost>保存并提交</Button>
                </Space>
            }
            onCancel={() => {
                setVisible(false);
            }}>
            <EvaluationInformation id={rowId} getLoading={(loading: boolean) => setConfirmLoading(loading)} ref={editRef} />
        </Modal>
    <SearchTable
        path="/tower-science/assessTask/assessList"
        columns={columns}
        headTabs={[]}
        exportPath={`/tower-science/assessTask/assessList`}
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
        onFilterSubmit={(values: any) => {
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
    </>
}