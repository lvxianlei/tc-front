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
            key: 'segI',
            title: '产品类型',
            width: 50,
            fixed: 'left' as FixedType,
            dataIndex: 'segI'
        },
        {
            key: 'partLabel',
            title: '定额条目',
            dataIndex: 'partLabel',
            fixed: 'left' as FixedType,
            width: 80
        },
        {
            key: 'materialTypename',
            title: '【0-330】电压等级定额',
            width: 100,
            dataIndex: 'materialTypename'
        },
        {
            key: 'materialMark',
            title: '【500kV-750kV】定额',
            width: 100,
            dataIndex: 'materialMark'
        },
        {
            key: 'spec',
            title: '【800kV+】定额',
            width: 80,
            dataIndex: 'spec'
        },
        {
            key: 'tolerance',
            title: '特殊定额',
            width: 80,
            dataIndex: 'tolerance'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 80,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={styles.operationBtn}>
                    <Button type="link" onClick={() => { }}>编辑</Button>
                    <Button type="link" onClick={() => { }}>删除</Button>
                </Space>
            )
        }
    ]

    const pickColumns = [
        {
            key: 'fileName',
            title: '产品类型',
            width: 80,
            dataIndex: 'fileName'
        },
        {
            key: 'segmentGroupName',
            title: '定额条目',
            width: 80,
            dataIndex: 'segmentGroupName'
        },
        {
            key: 'partLabelRange',
            title: '提料',
            width: 100,
            dataIndex: 'partLabelRange'
        },
        {
            key: 'fileType',
            title: '校核',
            width: 150,
            dataIndex: 'fileType'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 80,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={styles.operationBtn}>
                    <Button type="link" onClick={() => { }}>编辑</Button>
                    <Button type="link" onClick={() => { }}>删除</Button>
                </Space>
            )
        }
    ]

    const boltColumns = [
        {
            key: 'fileName',
            title: '产品类型',
            width: 80,
            dataIndex: 'fileName'
        },
        {
            key: 'segmentGroupName',
            title: '定额条目',
            width: 80,
            dataIndex: 'segmentGroupName'
        },
        {
            key: 'partLabelRange',
            title: '螺栓清点',
            width: 80,
            dataIndex: 'partLabelRange'
        },
        {
            key: 'fileType',
            title: '螺栓校核',
            width: 150,
            dataIndex: 'fileType'
        },
        {
            key: 'fileType',
            title: '螺栓计划-出',
            width: 150,
            dataIndex: 'fileType'
        },
        {
            key: 'fileType',
            title: '螺栓计划-校',
            width: 150,
            dataIndex: 'fileType'
        },
        {
            key: 'fileType',
            title: '螺栓清点套用',
            width: 150,
            dataIndex: 'fileType'
        },
        {
            key: 'fileSize',
            title: '螺栓计划套用',
            dataIndex: 'fileSize',
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
                    <Button type="link" onClick={() => { }}>编辑</Button>
                    <Button type="link" onClick={() => { }}>删除</Button>
                </Space>
            )
        }
    ]

    const otherColumns = [
        {
            key: 'fileName',
            title: '校核条目',
            width: 80,
            dataIndex: 'fileName'
        },
        {
            key: 'segmentGroupName',
            title: '金额',
            width: 80,
            dataIndex: 'segmentGroupName'
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
    const [visible, setVisible] = useState<boolean>(false);
    const history = useHistory();
    const newRef = useRef<EditRefProps>();
    const [nowColumns, setNowColumns] = useState<any>(columns);
    const [type, setType] = useState<'edit' | 'new'>('new');
    const [form] = useForm();

    const { loading, data, run } = useRequest<ILofting[]>((pagenation?: TablePaginationConfig, filterValue?: Record<string, any>) => new Promise(async (resole, reject) => {
        if (status === '1') {
            // const result = await RequestUtil.get<any>(`/tower-tdm/towerManuPart/${params.towerId}`, { current: pagenation?.current || 1, size: pagenation?.size || 15, querySegments: params.querySegments, ...filterValue });
            // setPage({ ...result })
            // resole(result?.records || [])
            resole([])
        } else if (status === '2') {
            const result = await RequestUtil.get<any>(`/tower-tdm/loftProcess/getLoftingFiles`, {

            });
            resole(result || [])
        } else if (status === '3') {
            const result = await RequestUtil.get<any>(`/tower-tdm/loftProcess/getLoftingFiles`, {

            });
            setPage({ ...result })
            resole(result || [])
        } else {
            resole([{id: '1'}])
        }
    }), { refreshDeps: [status] })

    const handleChangePage = (current: number, pageSize: number) => {
        setPage({ ...page, current: current, size: pageSize });
        run({ current: current, size: pageSize })
    }

    const handleOk = () => new Promise(async (resove, reject) => {
        try {
            await newRef.current?.onSubmit()
            message.success("上传成功！")
            setVisible(false)
            history.go(0)
            resove(true)
        } catch (error) {
            reject(false)
        }
    })

    const otherEdit = (record: Record<string, any>) => {
        Modal.confirm({
            title: "编辑",
            icon: null,
            closable: true,
            content: <Form form={form} labelCol={{span: 6}}>
                <Form.Item
                    label="金额"
                    name="planCompleteTime"
                    rules={[{ required: true, message: '请输入金额' }]}
                    initialValue={1.2}>
                    <InputNumber />
                </Form.Item>
            </Form>,
            onOk: async () => new Promise(async (resove, reject) => {
                try {
                    const value = await form.validateFields();
                    RequestUtil.post(``, { ...value }).then(res => {
                        message.success("编辑成功！")
                        form.resetFields()
                        history.go(0)
                    })
                    resove(true)
                } catch (error) {
                    reject(false)
                }
            }),
            onCancel() {
                form.resetFields()
            }
        })
    }

    return <Spin spinning={loading}>
        <Modal
            destroyOnClose
            key='LoftQuotaNew'
            visible={visible}
            title={type === 'new' ? '新增' : '编辑'}
            onOk={handleOk}
            onCancel={() => setVisible(false)}>
            <LoftQuotaNew type={type} ref={newRef} />
        </Modal>
        <Row className={styles.search}>
            <Radio.Group defaultValue={status} onChange={(event: RadioChangeEvent) => {
                setStatus(event.target.value);
                setNowColumns(event.target.value === '1' ? columns : event.target.value === '2' ? pickColumns : event.target.value === '3' ? boltColumns : otherColumns)
                run();
            }}>
                <Radio.Button value={'1'} key="1">放样定额配置</Radio.Button>
                <Radio.Button value={'2'} key="2">提料定额配置</Radio.Button>
                <Radio.Button value={'3'} key="3">螺栓定额配置</Radio.Button>
                <Radio.Button value={'4'} key="4">其他定额配置</Radio.Button>
            </Radio.Group>
            <Button type="primary" className={styles.topBtn} onClick={() => { setVisible(true); setType('new') }} ghost>新增</Button>
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