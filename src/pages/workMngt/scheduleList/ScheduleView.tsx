import React, { useRef, useState } from 'react'
import { Space, Input, Button, Form, Modal, Row, Col, Select, DatePicker, TreeSelect, Spin, message, Radio, Checkbox } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { CommonTable, DetailTitle, Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import TextArea from 'antd/lib/input/TextArea';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import moment from 'moment';
import { patternTypeOptions } from '../../../configuration/DictionaryOptions';
import SchedulePlan from './SchedulePlan';
import { tableColumns, columns } from "./userBase.json"
import SelectUser from '../../common/SelectUser';
import Assign from './Assign';

export interface modalProps {
    onSubmit: () => void;
    resetFields: () => void
}

export default function ScheduleView(): React.ReactNode {
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [visible, setVisible] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState({});
    const history = useHistory();
    const [planData, setPlanData] = useState<any | undefined>([]);
    const params = useParams<{ id: string, status: string }>();
    const assignModalRef = useRef<modalProps>();
    const [type, setType] = useState<'single' | 'batch' | 'detail'>('single');
    const [rowId, setRowId] = useState<string>('')

    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const planData: any = await RequestUtil.get(`/tower-science/assignPlan`);
        setPlanData(planData);
        resole(data)
    }), {})

    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows);
    }

    const handleModalOk = () => new Promise(async (resove, reject) => {
        try {
            await assignModalRef.current?.onSubmit();
            setVisible(false);
            message.success('指派成功！')
            setRefresh(!refresh);
            assignModalRef.current?.resetFields();
            resove(true);
        } catch (error) {
            reject(error)
        }
    })

    const handleModalCancel = () => {
        setVisible(false);
        assignModalRef.current?.resetFields();
    };

    const onFilterSubmit = (value: any) => {
        setFilterValue(value)
        return value
    }

    return (
        <>
            <Modal
                destroyOnClose
                visible={visible}
                width="95%"
                title={"指派信息"}
                footer={
                    type==='detail' ? null : <>
                        <SchedulePlan plan={setPlanData} />
                        <Button onClick={handleModalCancel}>取消</Button>
                        <Button type='primary' onClick={handleModalOk}>保存并提交</Button>
                    </>
                }
                key='add'
                onCancel={handleModalCancel}>
                <Assign id={rowId} ids={selectedKeys} type={type} planData={planData} ref={assignModalRef} />
            </Modal>
            <Page
                path={`/tower-science/productCategory/taskPage`}
                columns={[
                    {
                        key: "index",
                        title: "序号",
                        dataIndex: "index",
                        width: 50,
                        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                    },
                    ...columns,
                    {
                        key: 'operation',
                        title: '操作',
                        dataIndex: 'operation',
                        fixed: 'right' as FixedType,
                        width: 100,
                        render: (_: undefined, record: any): React.ReactNode => (
                            <Space direction="horizontal" size="small">
                                <Button type='link' onClick={async () => {
                                    setVisible(true);
                                    setType('single');
                                    setRowId(record?.id);
                                }} disabled={record.loftingStatus === 5 && record.boltStatus === 4 && record.weldingStatus === 4 && record.smallSampleStatus === 2 && record.templateLoftingStatus === 2}>指派</Button>
                                <Button type='link' onClick={async () => {
                                    setVisible(true);
                                    setType('detail');
                                    setRowId(record?.id);
                                    
                                }} disabled={!record.loftingLeaderName}>详情</Button>
                            </Space>
                        )
                    }]}
                exportPath={`/tower-science/productCategory/taskPage`}
                extraOperation={
                    <Space>
                        <Button type="primary" ghost onClick={async () => {
                            setVisible(true);
                            setType('batch');
                            setRowId(selectedKeys.join(','));
                        }} disabled={!(selectedKeys.length > 0)}>批量指派</Button>
                        <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
                    </Space>
                }
                requestData={{ loftingTaskId: params.id }}
                onFilterSubmit={onFilterSubmit}
                refresh={refresh}
                tableProps={{
                    rowSelection: {
                        type: "checkbox",
                        selectedRowKeys: selectedKeys,
                        onChange: SelectChange,
                    }
                }}
                filterValue={filterValue}
                searchFormItems={[
                    {
                        name: 'pattern',
                        label: '模式',
                        children: <Select style={{ width: '150px' }} getPopupContainer={triggerNode => triggerNode.parentNode}>
                            {patternTypeOptions && patternTypeOptions.map(({ id, name }, index) => {
                                return <Select.Option key={index} value={id}>
                                    {name}
                                </Select.Option>
                            })}
                        </Select>
                    },
                    {
                        name: 'priority',
                        label: '优先级',
                        children: <Select style={{ width: "100px" }}>
                            <Select.Option value={''} key={''}>全部</Select.Option>
                            <Select.Option value='1' key='1'>紧急</Select.Option>
                            <Select.Option value='2' key='2'>高</Select.Option>
                            <Select.Option value='3' key='3'>中</Select.Option>
                            <Select.Option value='4' key='4'>低</Select.Option>
                        </Select>
                    },
                    {
                        name: 'fuzzyMsg',
                        label: '模糊查询项',
                        children: <Input placeholder="请输入塔型/钢印塔型进行查询" maxLength={200} />
                    },
                ]}
            />
        </>
    )
}