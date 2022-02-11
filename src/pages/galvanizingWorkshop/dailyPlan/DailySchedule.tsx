import React, { useState } from 'react';
import { Input, DatePicker, Button, Form, Modal, Row, Col, Radio, message, Space } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './DailySchedule.module.less';
import RequestUtil from '../../../utils/RequestUtil';
import TeamSelectionModal from '../../../components/TeamSelectionModal';
import { IDailySchedule } from '../IGalvanizingWorkshop';
import { columns } from "../galvanizingWorkshop.json";

export default function DailySchedule(): React.ReactNode {
    const [refresh, setRefresh] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState({});
    const [confirmStatus, setConfirmStatus] = useState<number>(1);
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [visible, setVisible] = useState(false);
    const [detail, setDetail] = useState<IDailySchedule>({});
    const [form] = Form.useForm();

    const closeModal = () => {
        setVisible(false);
        form.resetFields();
        setDetail({});
        setSelectedKeys([]);
    }

    const submit = () => {
        if (form) {
            form.validateFields().then(res => {
                const values = form.getFieldsValue(true);
                RequestUtil.post(`/tower-production/galvanized/daily/plan/dispatching`, { ...values, id: selectedKeys.join(',') }).then(res => {
                    message.success("派工成功");
                    setRefresh(!refresh);
                    closeModal();
                });
            })
        }
    }

    const operationChange = (event: any) => {
        setConfirmStatus(parseFloat(`${event.target.value}`));
        setRefresh(!refresh);
    }

    const SelectChange = (selectedRowKeys: React.Key[]): void => {
        setSelectedKeys(selectedRowKeys);
    }

    return <>
        <Page
            path="/tower-production/galvanized/daily/plan"
            sourceKey="galvanizedDailyPlanVOS.records"
            columns={
                confirmStatus === 1 || confirmStatus === 2 || confirmStatus === 3 ?
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
                            <Space>
                                {
                                    confirmStatus === 1 ? <Button type="link" onClick={() => {
                                        RequestUtil.post(`/tower-production/galvanized/daily/plan/confirm`, [record.id]).then(res => {
                                            message.success("确认成功");
                                            setRefresh(!refresh);
                                            setSelectedKeys([]);
                                        });
                                    }}>确认</Button> :
                                        confirmStatus === 2 ? <Button type="link" onClick={() => {
                                            setVisible(true);
                                            setSelectedKeys([record.id]);
                                        }}>派工</Button> :
                                            confirmStatus === 3 ? <>
                                                {
                                                    new Date(Date.parse(record?.galvanizedStartTime?.replace(/-/g, "/"))) > new Date() ? <Button type="link" onClick={async () => {
                                                        const data: IDailySchedule = await RequestUtil.get(`/tower-production/galvanized/daily/plan/detail/${record.id}`);
                                                        form.setFieldsValue({ ...data });
                                                        setDetail(data);
                                                        setSelectedKeys([record.id]);
                                                        setVisible(true);
                                                    }}>重新派工</Button>
                                                        : null
                                                }
                                                <Button type="link" onClick={() => {
                                                    RequestUtil.get(`/tower-production/galvanized/daily/plan/complete/${record.id}`).then(res => {
                                                        message.success("完成！");
                                                        setRefresh(!refresh);
                                                    });
                                                }}>完成</Button>
                                            </>
                                                : null
                                }
                            </Space>
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
            extraOperation={(data: any) => <>
                <Radio.Group defaultValue={confirmStatus} onChange={operationChange}>
                    <Radio.Button value={1}>未确认</Radio.Button>
                    <Radio.Button value={2}>未指派</Radio.Button>
                    <Radio.Button value={3}>已指派</Radio.Button>
                    <Radio.Button value={4}>已完成</Radio.Button>
                </Radio.Group>
                <span className={styles.statistical}>统计
                    <span className={styles.statistical}>下达总重量：<span className={styles.statisticalNum}>{data?.issueTotalWeight}</span>吨</span>
                    <span className={styles.statistical}>角钢总重量：<span className={styles.statisticalNum}>{data?.angleTotalWeight}</span>吨</span>
                    <span className={styles.statistical}>连板总重量：<span className={styles.statisticalNum}>{data?.plateTotalWeight}</span>吨</span>
                </span>
                {
                    confirmStatus === 1
                        ? <Button type="primary" disabled={selectedKeys.length <= 0} onClick={() => {
                            RequestUtil.post(`/tower-production/galvanized/daily/plan/confirm`, selectedKeys).then(res => {
                                message.success("确认成功");
                                setRefresh(!refresh);
                            });
                        }}>批量确认</Button>
                        : confirmStatus === 2
                            ? <Button type="primary" disabled={selectedKeys.length <= 0} onClick={() => {
                                setVisible(true);
                            }}>派工</Button>
                            : null
                }
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
                    name: 'time',
                    label: '结束时间',
                    children: <DatePicker.RangePicker />
                },
                {
                    name: 'fuzzyMsg',
                    label: "模糊查询项",
                    children: <Input style={{ width: '300px' }} placeholder="请输入订单工程名称/计划号/塔型进行查询" />
                }
            ]}
            filterValue={filterValue}
            onFilterSubmit={(values: Record<string, any>) => {
                if (values.time) {
                    const formatDate = values.time.map((item: any) => item.format("YYYY-MM-DD"));
                    values.galvanizedStartTime = formatDate[0];
                    values.galvanizedEndTime = formatDate[1];
                }
                setFilterValue(values);
                return values;
            }}
        />
        <Modal title="派工" width='50%' visible={visible} cancelText="取消" okText="确认派工" onCancel={closeModal} onOk={submit}>
            <Form form={form} labelCol={{ span: 6 }}>
                <Row>
                    <Col span={12}>
                        <Form.Item label="穿挂班组" name="wearHangTeamName" rules={[{
                            required: true,
                            message: '请选择穿挂班组'
                        }]}>
                            <Input maxLength={50} value={detail.wearHangTeamName} addonBefore={<TeamSelectionModal onSelect={(selectedRows: object[] | any) => {
                                form.setFieldsValue({ wearHangTeamName: selectedRows && selectedRows[0].name, wearHangTeamId: selectedRows && selectedRows[0].id })
                            }} />} disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="酸洗班组" name="picklingTeamName" rules={[{
                            required: true,
                            message: '请选择酸洗班组'
                        }]}>
                            <Input maxLength={50} value={detail.picklingTeamName} addonBefore={<TeamSelectionModal onSelect={(selectedRows: object[] | any) => {
                                form.setFieldsValue({ picklingTeamName: selectedRows && selectedRows[0].name, picklingTeamId: selectedRows && selectedRows[0].id })
                            }} />} disabled />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label="检修班组" name="maintenanceTeamName" rules={[{
                            required: true,
                            message: '请选择检修班组'
                        }]}>
                            <Input maxLength={50} value={detail.maintenanceTeamName} addonBefore={<TeamSelectionModal onSelect={(selectedRows: object[] | any) => {
                                form.setFieldsValue({ maintenanceTeamName: selectedRows && selectedRows[0].name, maintenanceTeamId: selectedRows && selectedRows[0].id })
                            }} />} disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="锌锅班组" name="zincPotTeamName" rules={[{
                            required: true,
                            message: '请选择锌锅班组'
                        }]}>
                            <Input maxLength={50} value={detail.zincPotTeamName} addonBefore={<TeamSelectionModal onSelect={(selectedRows: object[] | any) => {
                                form.setFieldsValue({ zincPotTeamName: selectedRows && selectedRows[0].name, zincPotTeamId: selectedRows && selectedRows[0].id })
                            }} />} disabled />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    </>
}