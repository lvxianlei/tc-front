/**
 * @author zyc
 * @copyright © 2021 
*/

import React, { useState } from 'react';
import { Spin, Button, Space, Form, Input, Descriptions, DatePicker, Select, Modal, Row, Col } from 'antd';
import { Link, useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable } from '../common';
import RequestUtil from '../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './TransportTask.module.less';
import { CloseOutlined } from '@ant-design/icons';
import { FixedType } from 'rc-table/lib/interface';
import VehicleSelectionModal from '../../components/VehicleSelectionModal';
import WorkshopUserSelectionComponent from '../../components/WorkshopUserModal';

export default function WeighingNew(): React.ReactNode {
    const history = useHistory();
    const [form] = Form.useForm();
    const params = useParams<{ id: string }>();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [visible, setVisible] = useState(false);
    const [user, setUser] = useState([]);
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        let data = {};
        if (params.id) {
            data = await RequestUtil.get(`/tower-science/boltRecord/detail`, { productCategory: params.id })
        }
        resole(data)
    }), {})
    const detailData: any = data
    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    const tableColumns = [
        {
            key: 'createDeptName',
            title: '运输人员',
            dataIndex: 'createDeptName',
        },
        {
            key: 'createUserName',
            title: '任务编号',
            dataIndex: 'createUserName'
        },
        {
            key: 'createTime',
            title: '计划号',
            dataIndex: 'createTime'
        },
        {
            key: 'currentStatus',
            title: '塔型',
            dataIndex: 'currentStatus'
        },
        {
            key: 'currentStatus',
            title: '加工车间',
            dataIndex: 'currentStatus'
        },
        {
            key: 'currentStatus',
            title: '转运车间',
            dataIndex: 'currentStatus'
        },
        {
            key: 'currentStatus',
            title: '转运日期',
            dataIndex: 'currentStatus'
        },
        {
            key: 'operation',
            title: '构件明细',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 150,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Link to={`/vehicleTransport/transportTask/dispatch/detail/${record.id}`}>明细</Link>
            )
        }
    ]

    const specialColums = [
        {
            dataIndex: "materialSandard",
            title: "派工车辆",
            children: <Input maxLength={50} addonBefore={<VehicleSelectionModal onSelect={(selectedRows: object[] | any) => {
                // setSelectedRows(selectedRows);
                // setDetail({ ...detail, accountEquipmentName: selectedRows[0].deviceName });
                form.setFieldsValue({ accountEquipmentName: selectedRows[0].deviceName })
            }} />} addonAfter={<Button type="link" style={{ padding: '0', lineHeight: 1, height: 'auto' }} onClick={() => {
                // setSelectedRows([]);
                // setDetail({ ...detail, accountEquipmentName: '', accountEquipmentId: '' });
                // form.setFieldsValue({ accountEquipmentName: '', accountEquipmentId: '' })
            }}><CloseOutlined /></Button>} disabled />,
            initialValue: detailData.materialSandard
        },
        {
            dataIndex: "materialSandard",
            title: "任务时间范围",
            rules: [{
                required: true,
                message: '请选择任务时间'
            }],
            children: <DatePicker.RangePicker />
        },
        {
            dataIndex: "materialSandard",
            title: "仅显示未派工任务",
            children: <Select placeholder="请选择" style={{ width: "150px" }}>
                <Select.Option value={0} key="0">是</Select.Option>
                <Select.Option value={1} key="1">否</Select.Option>
            </Select>
        }
    ]

    const confirmDispatch = () => {
        setVisible(true);
        // if(selectedRows.length > 0) {

        // } else {
        //     message.warning('请选择运输任务');
        // }
    }

    return <>
        <DetailContent operation={[
            <Space direction="horizontal" size="small" >
                <Button type="ghost" onClick={() => history.goBack()}>关闭</Button>
            </Space>
        ]}>
            <Form form={form} onFinish={(values: Record<string, any>) => { }}>
                <Descriptions title="" bordered size="small" column={3}>
                    {
                        specialColums.map((item: Record<string, any>, index: number) => {
                            return <Descriptions.Item key={index} label={item.title} className={styles.detailItem}>
                                <Form.Item key={item.dataIndex + '_' + index} name={item.dataIndex} label="" rules={item.rules || []} initialValue={item.initialValue}>
                                    {item.children}
                                </Form.Item>
                            </Descriptions.Item>
                        })
                    }
                </Descriptions>
                <Space direction="horizontal" size="small" className={styles.searchBtn}>
                    <Button type="primary" htmlType="submit">查询</Button>
                    <Button type="ghost" htmlType="reset">重置</Button>
                </Space>
            </Form>
            <p className={styles.dispathtitle}>*运输任务<Button type="primary" onClick={confirmDispatch}>确认派工</Button></p>
            <CommonTable columns={tableColumns} dataSource={detailData.statusRecordList} pagination={false} rowSelection={{
                selectedRowKeys: selectedRowKeys || [], onChange: (selectedKeys: [], selectedRows: []) => {
                    setSelectedRowKeys(selectedKeys);
                    setSelectedRows(selectedRows);
                }
            }} />
        </DetailContent>
        <Modal title="选择司机" visible={visible} okText="确认指派" onOk={() => { }} onCancel={() => {
            setVisible(false);
        }}>
            <Row>
                <Col span={4}>司机</Col>
                <Col span={20}>
                    <Input maxLength={50} value={user} addonBefore={<WorkshopUserSelectionComponent onSelect={(selectedRows: object[] | any) => {
                        setUser(selectedRows);
                    }} buttonTitle="+选择人员" buttonType="link" />} addonAfter={<Button type="link" style={{ padding: '0', lineHeight: 1, height: 'auto' }} onClick={() => {
                        setUser([]);
                    }}><CloseOutlined /></Button>} disabled />
                </Col>
            </Row>
        </Modal>
    </>
}