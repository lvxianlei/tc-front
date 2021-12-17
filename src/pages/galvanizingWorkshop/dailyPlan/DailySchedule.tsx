import React, { useState } from 'react';
import { Input, DatePicker, Button, Form, Modal, Row, Col, Radio } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './DailySchedule.module.less';
import RequestUtil from '../../../utils/RequestUtil';
import TeamSelectionModal from '../../../components/TeamSelectionModal';
import { IDailySchedule } from '../IGalvanizingWorkshop';
import { columns } from "../galvanizingWorkshop.json";

interface IDetail {
    readonly accountEquipmentName?: string;
}

export default function DailySchedule(): React.ReactNode {
    const [refresh, setRefresh] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState({});
    const [confirmStatus, setConfirmStatus] = useState<number>(0);
    const [ selectedKeys, setSelectedKeys ] = useState<React.Key[]>([]);
    const [ selectedRows, setSelectedRows ] = useState<IDailySchedule[]>([]);
    const [visible, setVisible] = useState(false);
    const [detail, setDetail] = useState<IDetail>({});
    const [form] = Form.useForm();

    const closeModal = () => {
        setVisible(false);
        form.resetFields();
        setDetail({});
    }

    const submit = () => {

    }

    const operationChange = (event: any) => {
        setConfirmStatus(parseFloat(`${event.target.value}`));
        setRefresh(!refresh);
    }

    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: IDailySchedule[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows)
    }

    return <>
        <Page
            path="/tower-science/loftingTask/taskPage"
            columns={
                confirmStatus === 0 || confirmStatus === 1 || confirmStatus === 2 ? 
                [{
                    "key": "index",
                    "title": "序号",
                    "dataIndex": "index",
                    "width": 50,
                    render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
                }, ...columns, {
                    "key": "operation",
                    "title": "操作",
                    "dataIndex": "operation",
                    fixed: "right" as FixedType,
                    "width": 150,
                    render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                        confirmStatus === 0 ? <Button type="link" onClick={() => {
                            RequestUtil.get(``).then(res => {
                                setRefresh(!refresh);
                            });
                        }}>确认</Button> : confirmStatus === 1 ? <Button type="link" onClick={() => {
                            setVisible(true);
                        }}>派工</Button>: confirmStatus === 2 ? <><Button type="link" onClick={() => {
                            setVisible(true);
                        }}>重新派工</Button><Button type="link" onClick={() => {
                            RequestUtil.get(``).then(res => {
                                setRefresh(!refresh);
                            });
                        }}>完成</Button></> : null
                    )
                }] : [{
                    "key": "index",
                    "title": "序号",
                    "dataIndex": "index",
                    "width": 50,
                    render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
                }, ...columns]}
            headTabs={[]}
            requestData={{ status: confirmStatus }}
            extraOperation={<>
                <Radio.Group defaultValue={confirmStatus} onChange={operationChange}>
                    <Radio.Button value={0}>未确认</Radio.Button>
                    <Radio.Button value={1}>未指派</Radio.Button>
                    <Radio.Button value={2}>已指派</Radio.Button>
                    <Radio.Button value={3}>已完成</Radio.Button>
                </Radio.Group>
                <span>统计<span className={styles.statistical}>下达总重量：{}吨</span><span className={styles.statistical}>角钢总重量：{}吨</span><span className={styles.statistical}>连板总重量：{}吨</span></span>
                {confirmStatus === 0 ? <Button type="primary" onClick={() => {
                    RequestUtil.get(``).then(res => {
                        setRefresh(!refresh);
                    });
                }}>批量确认</Button> : confirmStatus === 1 ? <Button type="primary" onClick={() => {
                    setVisible(true);
                }}>派工</Button> : null}
                </>}
            refresh={refresh}
            tableProps={{
                rowSelection: {
                    selectedRowKeys: selectedKeys,
                    onChange: SelectChange
                }
            }}
            searchFormItems={[
                {
                    name: 'fuzzyMsg',
                    label: '',
                    children: <Input style={{ width: '300px' }} placeholder="请输入订单工程名称/计划号/塔型进行查询" />
                },
                {
                    name: 'updateStatusTime',
                    label: '送齐时间',
                    children: <DatePicker.RangePicker />
                }
            ]}
            filterValue={filterValue}
            onFilterSubmit={(values: Record<string, any>) => {
                if (values.updateStatusTime) {
                    const formatDate = values.updateStatusTime.map((item: any) => item.format("YYYY-MM-DD"));
                    values.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
                    values.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
                }
                setFilterValue(values);
                return values;
            }}
        />
        <Modal title="派工" width='50%' visible={visible} cancelText="取消" okText="确认派工" onCancel={closeModal} onOk={submit}>
            <Form form={form} labelCol={{ span: 6 }}>
                <Row>
                    <Col span={12}>
                        <Form.Item label="穿挂班组" name="chaungua" rules={[{
                            required: true,
                            message: '请选择穿挂班组'
                        }]}>
                            <Input maxLength={50} value={detail.accountEquipmentName} addonBefore={<TeamSelectionModal onSelect={(selectedRows: object[] | any) => {
                                // setSelectedRows(selectedRows);
                                setDetail({ ...detail, accountEquipmentName: selectedRows[0].deviceName });
                                form.setFieldsValue({ accountEquipmentName: selectedRows[0].deviceName })
                            }} />} disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="酸洗班组" name="chaungua" rules={[{
                            required: true,
                            message: '请选择酸洗班组'
                        }]}>
                            <Input maxLength={50} value={detail.accountEquipmentName} addonBefore={<TeamSelectionModal onSelect={(selectedRows: object[] | any) => {
                                // setSelectedRows(selectedRows);
                                setDetail({ ...detail, accountEquipmentName: selectedRows[0].deviceName });
                                form.setFieldsValue({ accountEquipmentName: selectedRows[0].deviceName })
                            }} />} disabled />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label="检修班组" name="chaungua" rules={[{
                            required: true,
                            message: '请选择检修班组'
                        }]}>
                            <Input maxLength={50} value={detail.accountEquipmentName} addonBefore={<TeamSelectionModal onSelect={(selectedRows: object[] | any) => {
                                // setSelectedRows(selectedRows);
                                setDetail({ ...detail, accountEquipmentName: selectedRows[0].deviceName });
                                form.setFieldsValue({ accountEquipmentName: selectedRows[0].deviceName })
                            }} />} disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="锌锅班组" name="chaungua" rules={[{
                            required: true,
                            message: '请选择锌锅班组'
                        }]}>
                            <Input maxLength={50} value={detail.accountEquipmentName} addonBefore={<TeamSelectionModal onSelect={(selectedRows: object[] | any) => {
                                // setSelectedRows(selectedRows);
                                setDetail({ ...detail, accountEquipmentName: selectedRows[0].deviceName });
                                form.setFieldsValue({ accountEquipmentName: selectedRows[0].deviceName })
                            }} />} disabled />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    </>
}