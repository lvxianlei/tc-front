/**
 * @author zyc
 * @copyright © 2022
 * @description RD-资料管理-工程资料管理
 */

import React, { useEffect, useRef, useState } from 'react';
import { Space, Form, Image, Spin, Button, TablePaginationConfig, Radio, RadioChangeEvent, Row, message, Modal, InputNumber, Col, Select, Popconfirm, Input } from 'antd';
import { CommonTable } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './EngineeringData.module.less';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import { useHistory, useParams } from 'react-router-dom';
import { useForm } from 'antd/es/form/Form';
import { productTypeOptions, supplyTypeOptions, voltageGradeOptions } from '../../../configuration/DictionaryOptions';
import DataUpload from './DataUpload';

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
            title: '合同编号',
            width: 50,
            dataIndex: 'productTypeName'
        },
        {
            key: 'projectEntries',
            title: '项目名称',
            dataIndex: 'projectEntries',
            width: 80
        },
        {
            key: 'voltageGradePriceFirst',
            title: '工程名称',
            width: 100,
            dataIndex: 'voltageGradePriceFirst'
        },
        {
            key: 'voltageGradePriceSecond',
            title: '客户名称',
            width: 100,
            dataIndex: 'voltageGradePriceSecond'
        },
        {
            key: 'voltageGradePriceThird',
            title: '电压等级',
            width: 80,
            dataIndex: 'voltageGradePriceThird'
        },
        {
            key: 'specialPrice',
            title: '产品类型',
            width: 80,
            dataIndex: 'specialPrice'
        },
        {
            key: 'specialPrice',
            title: '计划号',
            width: 80,
            dataIndex: 'specialPrice'
        },
        {
            key: 'specialPrice',
            title: '备注',
            width: 80,
            dataIndex: 'specialPrice'
        }
    ]

    const detailColumns = [
        {
            key: 'productTypeName',
            title: '文件名',
            width: 50,
            dataIndex: 'productTypeName'
        },
        {
            key: 'projectEntries',
            title: '文件类型',
            dataIndex: 'projectEntries',
            width: 80
        },
        {
            key: 'voltageGradePriceFirst',
            title: '应用计划',
            width: 100,
            dataIndex: 'voltageGradePriceFirst'
        },
        {
            key: 'voltageGradePriceSecond',
            title: '文件后缀',
            width: 100,
            dataIndex: 'voltageGradePriceSecond'
        },
        {
            key: 'voltageGradePriceThird',
            title: '上传人',
            width: 80,
            dataIndex: 'voltageGradePriceThird'
        },
        {
            key: 'specialPrice',
            title: '上传时间',
            width: 80,
            dataIndex: 'specialPrice'
        },
        {
            key: 'specialPrice',
            title: '备注',
            width: 80,
            dataIndex: 'specialPrice'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 100,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type="link" onClick={() => {
                        Modal.confirm({
                            title: "查看",
                            icon: null,
                            content: <Image src={record?.url || ''} />,
                            cancelText: "关闭",
                            okButtonProps: { style: { display: 'none' } }
                        })
                    }}>查看</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={() => {
                            RequestUtil.delete(``).then(res => {
                                message.success('删除成功');
                                history.go(0)
                            });
                        }}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link">删除</Button>
                    </Popconfirm>
                    <Button type="link" onClick={() => { }}>下载</Button>
                    <Button type="link" onClick={() => { }}>编辑</Button>
                </Space>
            )
        }
    ]

    const [page, setPage] = useState({
        current: 1,
        size: 15,
        total: 0
    })

    const [status, setStatus] = useState<string>('');
    const history = useHistory();
    const newRef = useRef<EditRefProps>();
    const [visible, setVisible] = useState<boolean>(false);
    const [type, setType] = useState<'edit' | 'new'>('new');
    const [form] = useForm();
    const [searchForm] = useForm();
    const [detailData, setDetailData] = useState<any>();
    const [rowData, setRowData] = useState<any>();
    const [filterValues, setFilterValues] = useState<Record<string, any>>();
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);


    useEffect(() => {
        setConfirmLoading(confirmLoading);
    }, [confirmLoading])


    const { loading, data, run } = useRequest<ILofting[]>((pagenation?: TablePaginationConfig, filter?: Record<string, any>) => new Promise(async (resole, reject) => {
        const result = await RequestUtil.get<any>(`/tower-science/projectPrice/list`, { current: pagenation?.current || 1, size: pagenation?.size || 15, category: status, ...filter });
        setPage({ ...result })
        resole(result?.records || [])
    }), { refreshDeps: [status] })

    const { run: detailRun } = useRequest<any>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result = await RequestUtil.get(`/tower-science/performance/product/segment/${id}`);
            setDetailData(result);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

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

    const onRowChange = async (record: Record<string, any>) => {
        detailRun(record.id);
        setRowData(record)
    }

    const onSearch = (values: Record<string, any>) => {
        detailRun(rowData?.id)
    }

    const onFinish = (values: Record<string, any>) => {
        setFilterValues(values);
        run({}, { ...values });
    }

    return <Spin spinning={loading}>
        <Modal
            destroyOnClose
            key='DataUpload'
            visible={visible}
            width="50%"
            title={'上传'}
            okText="保存"
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={() => setVisible(false)}>
            <DataUpload getLoading={(loading) => setConfirmLoading(loading)} type={type} record={rowData} ref={newRef} />
        </Modal>
        <Form form={searchForm} layout="inline" className={styles.search} onFinish={onFinish}>

            <Form.Item label='电压等级' name="status">

                <Select placeholder="请选择电压等级">
                    {voltageGradeOptions && voltageGradeOptions.map(({ id, name }, index) => {
                        return <Select.Option key={index} value={id}>
                            {name}
                        </Select.Option>
                    })}
                </Select>
            </Form.Item>

            <Form.Item label='工程类型' name="status" initialValue={''}>

                <Select placeholder="请选择工程类型">
                    <Select.Option value={''} key="0">全部</Select.Option>
                    <Select.Option value={'国内'} key="1">国内</Select.Option>
                    <Select.Option value={'国外'} key="2">国外</Select.Option>

                </Select>
            </Form.Item>

            <Form.Item label='产品类型' name="status" initialValue={''}>

                <Select placeholder="请选择产品类型">
                    <Select.Option value={''} key="0">全部</Select.Option>
                    {productTypeOptions && productTypeOptions.map(({ id, name }, index) => {
                        return <Select.Option key={index} value={id}>
                            {name}
                        </Select.Option>
                    })}
                </Select>
            </Form.Item>
            <Form.Item label='模糊查询项' name="fuzzyMsg">
                <Input style={{ width: '400px' }} placeholder="合同编号/项目名称/工程名称/客户名称/计划号" />
            </Form.Item>
            <Form.Item>
                <Space direction="horizontal">
                    <Button type="primary" htmlType="submit">搜索</Button>
                    <Button htmlType="reset">重置</Button>

                </Space>
            </Form.Item>
        </Form>
        <CommonTable
            haveIndex
            columns={columns}
            dataSource={data}
            pagination={{
                current: page.current,
                pageSize: page.size,
                total: page?.total,
                onChange: handleChangePage
            }}
            onRow={(record: Record<string, any>) => ({
                onClick: () => onRowChange(record),
                className: styles.tableRow
            })}
        />
        <Row className={styles.search} gutter={12}>
            <Col>
                <Radio.Group defaultValue={status} onChange={(event: RadioChangeEvent) => {
                    setStatus(event.target.value);
                    run();
                }}>
                    <Radio.Button value={''} key="0">全部</Radio.Button>
                    {productTypeOptions && productTypeOptions.map(({ id, name }, index) => {
                        return <Radio.Button value={id} key={id}>{name}</Radio.Button>
                    })}
                </Radio.Group>

            </Col>
            <Col>
                <Form form={form} layout="inline" onFinish={onSearch}>

                    <Form.Item label='文件类型' name="status">

                        <Select placeholder="文件类型">
                            {voltageGradeOptions && voltageGradeOptions.map(({ id, name }, index) => {
                                return <Select.Option key={index} value={id}>
                                    {name}
                                </Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item label='计划号' name="status">

                        <Select placeholder="计划号">
                            {voltageGradeOptions && voltageGradeOptions.map(({ id, name }, index) => {
                                return <Select.Option key={index} value={id}>
                                    {name}
                                </Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Space direction="horizontal">
                            <Button type="primary" htmlType="submit">搜索</Button>
                            <Button htmlType="reset">重置</Button>

                        </Space>
                    </Form.Item>
                </Form>
            </Col>
            <Col>
                <Button type='primary' onClick={() => {
                    setVisible(true);
                    setType('new');
                }} ghost>上传</Button>
            </Col>
        </Row>

        <CommonTable
            haveIndex
            columns={detailColumns}
            dataSource={data}
            pagination={false}
        />
    </Spin>
}