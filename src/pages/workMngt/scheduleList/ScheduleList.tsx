import React, { useRef, useState } from 'react'
import { Space, Input, DatePicker, Select, Form, Modal, Button, message } from 'antd'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { Page, SearchTable } from '../../common'
import { FixedType } from 'rc-table/lib/interface';
import SchedulePlan from './SchedulePlan';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '@utils/RequestUtil';
import { modalProps } from './ScheduleView';
import Assign from './Assign';

export default function ScheduleList(): React.ReactNode {
    const [filterValue, setFilterValue] = useState({});
    const location = useLocation<{ state?: number }>();
    const [visible, setVisible] = useState<boolean>(false);
    const [planData, setPlanData] = useState<any | undefined>([]);
    const assignModalRef = useRef<modalProps>();
    const history = useHistory()
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);

    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const planData: any = await RequestUtil.get(`/tower-science/assignPlan`);
        setPlanData(planData);
        resole(data)
    }), {})

    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows);
    }

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
            title: '放样任务编号',
            width: 100,
            dataIndex: 'taskNum'
        },
        {
            key: 'planNumber',
            title: '计划号',
            width: 100,
            dataIndex: 'planNumber'
        },
        {
            key: 'saleOrderNumber',
            title: '订单编号',
            width: 100,
            dataIndex: 'saleOrderNumber'
        },
        {
            key: 'internalNumber',
            title: '内部合同编号',
            width: 100,
            dataIndex: 'internalNumber'
        },
        {
            key: 'plannedDeliveryTime',
            title: '计划交付时间',
            width: 200,
            dataIndex: 'plannedDeliveryTime'
        },
        {
            key: 'weight',
            title: '重量（吨）',
            width: 200,
            dataIndex: 'weight'
        },
        {
            key: 'productCategoryNum',
            title: '塔型（个）',
            width: 80,
            dataIndex: 'productCategoryNum'
        },
        {
            key: 'projectName',
            title: '工程名称',
            width: 150,
            dataIndex: 'projectName'
        },
        {
            key: 'productCategoryName',
            title: '塔型',
            width: 150,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productNum',
            title: '杆塔（基）',
            width: 80,
            dataIndex: 'productNum'
        },
        {
            key: 'statusName',
            title: '状态',
            dataIndex: 'statusName'
        },
        {
            key: 'updateStatusTime',
            title: '最新状态变更时间',
            dataIndex: 'updateStatusTime'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Link to={`/workMngt/scheduleList/scheduleView/${record.id}/${record.status}`}>查看</Link>
                </Space>
            )
        }
    ]


    const onFilterSubmit = (value: any) => {
        if (value.statusUpdateTime) {
            const formatDate = value.statusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
            value.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
            delete value.statusUpdateTime
        }
        if (value.planTime) {
            const formatDate = value.planTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.plannedDeliveryTimeStart = formatDate[0] + ' 00:00:00';
            value.plannedDeliveryTimeEnd = formatDate[1] + ' 23:59:59';
            delete value.planTime
        }
        setFilterValue(value)
        return value
    }

    const handleModalOk = () => new Promise(async (resove, reject) => {
        try {
            await assignModalRef.current?.onSubmit();
            setVisible(false);
            message.success('指派成功！')
            history?.go(0)
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

    return (<>
        <Modal
            destroyOnClose
            visible={visible}
            width="95%"
            title={"指派信息"}
            footer={
                <>
                    <SchedulePlan plan={setPlanData} />
                    <Button onClick={handleModalCancel}>取消</Button>
                    <Button type='primary' onClick={handleModalOk}>保存并提交</Button>
                </>
            }
            key='add'
            onCancel={handleModalCancel}>
            <Assign id={''} ids={selectedKeys} type={'taskBatch'} planData={planData} ref={assignModalRef} />
        </Modal>
        <SearchTable
            path="/tower-science/loftingTask"
            columns={columns}
            exportPath="/tower-science/loftingTask"
            onFilterSubmit={onFilterSubmit}
            filterValue={filterValue}
            requestData={{
                status: location.state?.state
            }}
            tableProps={{
                rowSelection: {
                    type: "checkbox",
                    selectedRowKeys: selectedKeys,
                    onChange: SelectChange,
                }
            }}
            extraOperation={
                <Space>
                    <Button type="primary" ghost onClick={async () => {
                        setVisible(true);
                    }} disabled={!(selectedKeys.length > 0)}>批量指派</Button>
                </Space>
            }
            pageSize={100}
            searchFormItems={[
                {
                    name: 'statusUpdateTime',
                    label: '最新状态变更时间',
                    children: <DatePicker.RangePicker format='YYYY-MM-DD' />
                },
                {
                    name: 'status',
                    label: '任务状态',
                    children: <Form.Item name="status" initialValue={location.state?.state || ''}>
                        <Select style={{ width: "100px" }}>
                            <Select.Option value={''} key={''}>全部</Select.Option>
                            <Select.Option value={2} key={2}>待指派</Select.Option>
                            <Select.Option value={3} key={3}>待完成</Select.Option>
                        </Select>
                    </Form.Item>
                },
                {
                    name: 'productCategoryName',
                    label: '塔型',
                    children: <Input placeholder="请输入" />
                },
                {
                    name: 'fuzzyMsg',
                    label: '模糊查询项',
                    children: <Input placeholder="放样任务编号/计划号/订单编号/内部合同编号" style={{ width: "350px" }} />
                }
            ]}
        />
    </>
    )
}