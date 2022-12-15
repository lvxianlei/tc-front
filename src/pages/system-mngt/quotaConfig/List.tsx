/**
 * @author zyc
 * @copyright © 2022
 * @description RD-系统配置-定额配置-列表
 */

import React, { useRef, useState } from 'react';
import { Space, Form, Spin, Button, TablePaginationConfig, Radio, RadioChangeEvent, Row, message, Modal, InputNumber } from 'antd';
import { CommonTable } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './QuotaConfig.module.less';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import { useHistory, useParams } from 'react-router-dom';
import LoftQuotaNew from './LoftQuotaNew';
import { useForm } from 'antd/es/form/Form';
import MaterialQuotaNew from './MaterialQuotaNew';
import BoltQuotaNew from './BoltQuotaNew';

export interface ILofting {
    readonly id?: string;
}

export interface EditRefProps {
    onSubmit: () => void
    resetFields: () => void
}

export default function List(): React.ReactNode {
    const columns = [
        {
            key: 'productTypeName',
            title: '产品类型',
            width: 50,
            fixed: 'left' as FixedType,
            dataIndex: 'productTypeName'
        },
        {
            key: 'projectEntries',
            title: '定额条目',
            dataIndex: 'projectEntries',
            fixed: 'left' as FixedType,
            width: 80
        },
        {
            key: 'voltageGradePriceFirst',
            title: '（0-330】电压等级定额',
            width: 100,
            dataIndex: 'voltageGradePriceFirst'
        },
        {
            key: 'voltageGradePriceSecond',
            title: '【500kV-750kV】定额',
            width: 100,
            dataIndex: 'voltageGradePriceSecond'
        },
        {
            key: 'voltageGradePriceThird',
            title: '【800kV+】定额',
            width: 80,
            dataIndex: 'voltageGradePriceThird'
        },
        {
            key: 'specialPrice',
            title: '特殊定额',
            width: 80,
            dataIndex: 'specialPrice'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 80,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={styles.operationBtn}>
                    <Button type="link" onClick={() => { setRowData(record); setVisible(true); setType('edit'); }}>编辑</Button>
                    <Button type="link" onClick={() => delRow(record.id)}>删除</Button>
                </Space>
            )
        }
    ]

    const pickColumns = [
        {
            key: 'productTypeName',
            title: '产品类型',
            width: 80,
            dataIndex: 'productTypeName'
        },
        {
            key: 'projectEntries',
            title: '定额条目',
            width: 80,
            dataIndex: 'projectEntries'
        },
        {
            key: 'materialCategory',
            title: '提料',
            width: 100,
            dataIndex: 'materialCategory'
        },
        {
            key: 'proofread',
            title: '校核',
            width: 150,
            dataIndex: 'proofread'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 80,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={styles.operationBtn}>
                    <Button type="link" onClick={() => { setMaterialRowData(record); setMaterialVisible(true); setMaterialType('edit'); }}>编辑</Button>
                    <Button type="link" onClick={() => delRow(record.id)}>删除</Button>
                </Space>
            )
        }
    ]

    const boltColumns = [
        {
            key: 'productTypeName',
            title: '产品类型',
            width: 80,
            dataIndex: 'productTypeName'
        },
        {
            key: 'projectEntries',
            title: '定额条目',
            width: 80,
            dataIndex: 'projectEntries'
        },
        {
            key: 'boltCheck',
            title: '螺栓清点',
            width: 80,
            dataIndex: 'boltCheck'
        },
        {
            key: 'boltProofread',
            title: '螺栓校核',
            width: 150,
            dataIndex: 'boltProofread'
        },
        {
            key: 'boltPlanCome',
            title: '螺栓计划-出',
            width: 150,
            dataIndex: 'boltPlanCome'
        },
        {
            key: 'boltPlanProofread',
            title: '螺栓计划-校',
            width: 150,
            dataIndex: 'boltPlanProofread'
        },
        {
            key: 'boltCheckApply',
            title: '螺栓清点套用',
            width: 150,
            dataIndex: 'boltCheckApply'
        },
        {
            key: 'boltCheckProofread',
            title: '螺栓校核套用',
            width: 150,
            dataIndex: 'boltCheckProofread'
        },
        {
            key: 'boltPlanApply',
            title: '螺栓计划套用',
            dataIndex: 'boltPlanApply',
            width: 120
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 80,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={styles.operationBtn}>
                    <Button type="link" onClick={() => { setBoltRowData(record); setBoltVisible(true); setBoltType('edit'); }}>编辑</Button>
                    <Button type="link" onClick={() => delRow(record.id)}>删除</Button>
                </Space>
            )
        }
    ]

    const otherColumns = [
        {
            key: 'projectEntries',
            title: '校核条目',
            width: 80,
            dataIndex: 'projectEntries'
        },
        {
            key: 'price',
            title: '金额',
            width: 80,
            dataIndex: 'price'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 80,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={styles.operationBtn}>
                    <Button type="link" onClick={() => otherEdit(record)}>编辑</Button>
                </Space>
            )
        }
    ]

    const [page, setPage] = useState({
        current: 1,
        size: 15,
        total: 0
    })

    const [status, setStatus] = useState<string>('1');
    const history = useHistory();
    const newRef = useRef<EditRefProps>();
    const [nowColumns, setNowColumns] = useState<any>(columns);
    const [visible, setVisible] = useState<boolean>(false);
    const [type, setType] = useState<'edit' | 'new'>('new');
    const [form] = useForm();
    const [rowData, setRowData] = useState<any>();
    const materialRef = useRef<EditRefProps>();
    const [materialVisible, setMaterialVisible] = useState<boolean>(false);
    const [materialType, setMaterialType] = useState<'edit' | 'new'>('new');
    const [materialRowData, setMaterialRowData] = useState<any>();
    const boltRef = useRef<EditRefProps>();
    const [boltVisible, setBoltVisible] = useState<boolean>(false);
    const [boltType, setBoltType] = useState<'edit' | 'new'>('new');
    const [boltRowData, setBoltRowData] = useState<any>();

    const { loading, data, run } = useRequest<ILofting[]>((pagenation?: TablePaginationConfig) => new Promise(async (resole, reject) => {
        const result = await RequestUtil.get<any>(`/tower-science/projectPrice/list`, { current: pagenation?.current || 1, size: pagenation?.size || 15, category: status });
        setPage({ ...result })
        resole(result?.records || [])
    }), { refreshDeps: [status] })

    const handleChangePage = (current: number, pageSize: number) => {
        setPage({ ...page, current: current, size: pageSize });
        run({ current: current, size: pageSize })
    }

    const handleOk = () => new Promise(async (resove, reject) => {
        try {
            await newRef.current?.onSubmit()
            message.success("保存成功！")
            setVisible(false)
            history.go(0)
            resove(true)
        } catch (error) {
            reject(false)
        }
    })

    const delRow = (id: string) => {
        Modal.confirm({
            title: "删除",
            content: "确定删除放样定额配置？",
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                RequestUtil.delete(`/tower-science/projectPrice?id=${id}`).then(res => {
                    message.success("删除成功！")
                    history.go(0)
                })
            }
        })
    }

    const otherEdit = (record: Record<string, any>) => {
        form.setFieldsValue({ price: record?.price })
        Modal.confirm({
            title: "编辑",
            icon: null,
            closable: true,
            content: <Form form={form} labelCol={{ span: 6 }}>
                <Form.Item
                    label="金额"
                    name="price"
                    rules={[{ required: true, message: '请输入金额' }]}
                    initialValue={record?.price}>
                    <InputNumber />
                </Form.Item>
            </Form>,
            onOk: async () => new Promise(async (resove, reject) => {
                try {
                    const value = await form.validateFields();
                    RequestUtil.post(`/tower-science/projectPrice/other`, { ...record, ...value }).then(res => {
                        message.success("编辑成功！")
                        form.setFieldsValue({ price: '' })
                        history.go(0)
                    })
                    resove(true)
                } catch (error) {
                    reject(false)
                }
            }),
            onCancel() {
                form.setFieldsValue({ price: '' })
            }
        })
    }

    const materialHandleOk = () => new Promise(async (resove, reject) => {
        try {
            await materialRef.current?.onSubmit()
            message.success("保存成功！")
            setMaterialVisible(false)
            history.go(0)
            resove(true)
        } catch (error) {
            reject(false)
        }
    })

    const boltHandleOk = () => new Promise(async (resove, reject) => {
        try {
            await boltRef.current?.onSubmit()
            message.success("保存成功！")
            setBoltVisible(false)
            history.go(0)
            resove(true)
        } catch (error) {
            reject(false)
        }
    })

    return <Spin spinning={loading}>
        <Modal
            destroyOnClose
            key='LoftQuotaNew'
            visible={visible}
            title={type === 'new' ? '新增' : '编辑'}
            onOk={handleOk}
            onCancel={() => setVisible(false)}>
            <LoftQuotaNew type={type} record={rowData} ref={newRef} />
        </Modal>
        <Modal
            destroyOnClose
            key='MaterialQuotaNew'
            visible={materialVisible}
            title={materialType === 'new' ? '新增' : '编辑'}
            onOk={materialHandleOk}
            onCancel={() => setMaterialVisible(false)}>
            <MaterialQuotaNew type={materialType} record={materialRowData} ref={materialRef} />
        </Modal>
        <Modal
            destroyOnClose
            key='boltQuotaNew'
            visible={boltVisible}
            title={boltType === 'new' ? '新增' : '编辑'}
            onOk={boltHandleOk}
            onCancel={() => setBoltVisible(false)}>
            <BoltQuotaNew type={boltType} record={boltRowData} ref={boltRef} />
        </Modal>
        <Row className={styles.search}>
            <Radio.Group defaultValue={status} onChange={(event: RadioChangeEvent) => {
                setStatus(event.target.value);
                setNowColumns(event.target.value === '1' ? columns : event.target.value === '2' ? pickColumns : event.target.value === '3' ? boltColumns : otherColumns)
                run();
            }}>
                {/* 1-放样、2-提料、3-螺栓、4-其他 */}
                <Radio.Button value={'1'} key="1">放样定额配置</Radio.Button>
                <Radio.Button value={'2'} key="2">提料定额配置</Radio.Button>
                <Radio.Button value={'3'} key="3">螺栓定额配置</Radio.Button>
                <Radio.Button value={'4'} key="4">其他定额配置</Radio.Button>
            </Radio.Group>
            {
                status === '4' ?
                    null
                    :
                    <Button type="primary" className={styles.topBtn} onClick={() => {
                        if (status === '1') {
                            setVisible(true);
                            setType('new');
                        } else if (status === '2') {
                            setMaterialVisible(true);
                            setMaterialType('new');
                        } else {
                            setBoltVisible(true);
                            setBoltType('new');
                        }
                    }} ghost>新增</Button>
            }
        </Row>
        <CommonTable
            haveIndex
            columns={nowColumns}
            dataSource={data}
            pagination={{
                current: page.current,
                pageSize: page.size,
                total: page?.total,
                onChange: handleChangePage
            }}
        />
    </Spin>
}