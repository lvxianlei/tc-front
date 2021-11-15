import React, { useState } from 'react';
import { Space, Input, DatePicker, Select, Button, Popconfirm, Form, Modal, Row, Col } from 'antd';
import { Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './DailySchedule.module.less';
import { Link, useLocation } from 'react-router-dom';
import RequestUtil from '../../utils/RequestUtil';
import TeamSelectionModal from '../../components/TeamSelectionModal';

interface IDetail {
    readonly accountEquipmentName?: string;
}

export default function DailySchedule(): React.ReactNode {
    const [ refresh, setRefresh ] = useState<boolean>(false);
    const [ filterValue, setFilterValue ] = useState({});
    const location = useLocation<{ state: {} }>();
    
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{ index + 1 }</span>)
        },
        {
            key: 'taskNum',
            title: '是否指派',
            width: 150,
            dataIndex: 'taskNum'
        },
        {
            key: 'taskNum',
            title: '订单工程名称',
            width: 150,
            dataIndex: 'taskNum'
        },
        {
            key: 'taskNum',
            title: '电压等级',
            width: 150,
            dataIndex: 'taskNum'
        },
        {
            key: 'taskNum',
            title: '计划号',
            width: 150,
            dataIndex: 'taskNum'
        },
        {
            key: 'taskNum',
            title: '塔型',
            width: 150,
            dataIndex: 'taskNum'
        },
        {
            key: 'taskNum',
            title: '基数',
            width: 150,
            dataIndex: 'taskNum'
        },
        {
            key: 'taskNum',
            title: '下达重量',
            width: 150,
            dataIndex: 'taskNum'
        },
        {
            key: 'taskNum',
            title: '角钢重量',
            width: 150,
            dataIndex: 'taskNum'
        },
        {
            key: 'taskNum',
            title: '连板重量',
            width: 150,
            dataIndex: 'taskNum'
        },
        {
            key: 'taskNum',
            title: '镀锌厂区',
            width: 150,
            dataIndex: 'taskNum'
        },
        {
            key: 'taskNum',
            title: '穿卦班组',
            width: 150,
            dataIndex: 'taskNum'
        },
        {
            key: 'taskNum',
            title: '酸洗班组',
            width: 150,
            dataIndex: 'taskNum'
        },
        {
            key: 'taskNum',
            title: '检修班组',
            width: 150,
            dataIndex: 'taskNum'
        },
        {
            key: 'taskNum',
            title: '锌锅班组',
            width: 150,
            dataIndex: 'taskNum'
        },
        {
            key: 'taskNum',
            title: '开镀锌时间',
            width: 150,
            dataIndex: 'taskNum'
        },
        {
            key: 'updateStatusTime',
            title: '要求车间送齐时间',
            width: 200,
            dataIndex: 'updateStatusTime'
        },
        {
            key: 'weight',
            title: '要求大锅镀锌完成时间',
            width: 200,
            dataIndex: 'weight'
        },
        {
            key: 'externalTaskNum',
            title: '要求连板镀锌完成时间',
            width: 200,
            dataIndex: 'externalTaskNum'
        },
        {
            key: 'saleOrderNumber',
            title: '送齐成品库时间',
            width: 200,
            dataIndex: 'saleOrderNumber'
        },
        {
            key: 'internalNumber',
            title: '包装班组',
            width: 200,
            dataIndex: 'internalNumber'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 150,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Button type="link" onClick={ () => {
                    setVisible(true);
                } }>派工</Button>
            )
        }
    ]

    const [ visible, setVisible ] = useState(false);
    const [ detail, setDetail ] = useState<IDetail>({});
    const [ form ] = Form.useForm();

    const closeModal = () => {
        setVisible(false);
        form.resetFields();
        setDetail({});
    }

    const submit = () => {

    }

    return <>
        <Page
            path="/tower-science/loftingTask/taskPage"
            columns={ columns }
            headTabs={ [{
                label: '未指派',
                key: 0
            }, {
                label: '已指派',
                key: 1
            }] }
            requestData={ { status: location.state } }
            extraOperation={ <Button type="primary" onClick={ () => {
                setVisible(true);
            } }>派工</Button> }
            refresh={ refresh }
            searchFormItems={ [
                {
                    name: 'fuzzyMsg',
                    label: '',
                    children: <Input style={{ width: '300px' }} placeholder="请输入订单工程名称/计划号/塔型进行查询"/>
                },
                {
                    name: 'updateStatusTime',
                    label: '送齐时间',
                    children: <DatePicker.RangePicker />
                }
            ] }
            filterValue={ filterValue }
            onFilterSubmit = { (values: Record<string, any>) => {
                if(values.updateStatusTime) {
                    const formatDate = values.updateStatusTime.map((item: any) => item.format("YYYY-MM-DD"));
                    values.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
                    values.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
                }
                setFilterValue(values);
                return values;
             } }
        />
        <Modal title="派工" width='50%' visible={ visible } cancelText="取消" okText="确认派工" onCancel={ closeModal } onOk={ submit }>
            <Form form={ form } labelCol={{ span: 6 }}>
                <Row>
                    <Col span={ 12 }>
                        <Form.Item label="穿挂班组" name="chaungua" rules={[{
                            required: true,
                            message: '请选择穿挂班组'
                        }]}>
                            <Input maxLength={ 50 } value={ detail.accountEquipmentName } addonBefore={ <TeamSelectionModal onSelect={ (selectedRows: object[] | any) => {
                                // setSelectedRows(selectedRows);
                                setDetail({ ...detail, accountEquipmentName: selectedRows[0].deviceName });
                                form.setFieldsValue({ accountEquipmentName: selectedRows[0].deviceName })
                            } }/> } disabled />
                        </Form.Item>
                    </Col>
                    <Col span={ 12 }>
                        <Form.Item label="酸洗班组" name="chaungua" rules={[{
                            required: true,
                            message: '请选择酸洗班组'
                        }]}>
                            <Input maxLength={ 50 } value={ detail.accountEquipmentName } addonBefore={ <TeamSelectionModal onSelect={ (selectedRows: object[] | any) => {
                                // setSelectedRows(selectedRows);
                                setDetail({ ...detail, accountEquipmentName: selectedRows[0].deviceName });
                                form.setFieldsValue({ accountEquipmentName: selectedRows[0].deviceName })
                            } }/> } disabled />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={ 12 }>
                        <Form.Item label="检修班组" name="chaungua" rules={[{
                            required: true,
                            message: '请选择检修班组'
                        }]}>
                            <Input maxLength={ 50 } value={ detail.accountEquipmentName } addonBefore={ <TeamSelectionModal onSelect={ (selectedRows: object[] | any) => {
                                // setSelectedRows(selectedRows);
                                setDetail({ ...detail, accountEquipmentName: selectedRows[0].deviceName });
                                form.setFieldsValue({ accountEquipmentName: selectedRows[0].deviceName })
                            } }/> } disabled />
                        </Form.Item>
                    </Col>
                    <Col span={ 12 }>
                        <Form.Item label="锌锅班组" name="chaungua" rules={[{
                            required: true,
                            message: '请选择锌锅班组'
                        }]}>
                            <Input maxLength={ 50 } value={ detail.accountEquipmentName } addonBefore={ <TeamSelectionModal onSelect={ (selectedRows: object[] | any) => {
                                // setSelectedRows(selectedRows);
                                setDetail({ ...detail, accountEquipmentName: selectedRows[0].deviceName });
                                form.setFieldsValue({ accountEquipmentName: selectedRows[0].deviceName })
                            } }/> } disabled />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    </>
}