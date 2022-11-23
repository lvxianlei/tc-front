/**
 * @author zyc
 * @copyright © 2022
 * @description RD-资料管理-资料存档管理
 */

import React, { useEffect, useRef, useState } from 'react';
import { Space, Form, Spin, Button, TablePaginationConfig, Radio, RadioChangeEvent, Row, message, Modal, InputNumber, Col, Select, Input, Popconfirm } from 'antd';
import { CommonTable, Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './DataArchiving.module.less';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import { useHistory, useParams } from 'react-router-dom';
import { useForm } from 'antd/es/form/Form';
import { supplyTypeOptions } from '../../../configuration/DictionaryOptions';
import DataArchivingNew from './DataArchivingNew';

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
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            fixed: "left" as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'productTypeName',
            title: '状态',
            width: 50,
            dataIndex: 'productTypeName'
        },
        {
            key: 'projectEntries',
            title: '资料室',
            dataIndex: 'projectEntries',
            width: 80
        },
        {
            key: 'voltageGradePriceFirst',
            title: '资料类型',
            width: 100,
            dataIndex: 'voltageGradePriceFirst'
        },
        {
            key: 'voltageGradePriceSecond',
            title: '文件类别',
            width: 100,
            dataIndex: 'voltageGradePriceSecond'
        },
        {
            key: 'voltageGradePriceThird',
            title: '柜号',
            width: 80,
            dataIndex: 'voltageGradePriceThird'
        },
        {
            key: 'specialPrice',
            title: '箱号',
            width: 80,
            dataIndex: 'specialPrice'
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
            title: '工程名称',
            width: 80,
            dataIndex: 'specialPrice'
        },
        {
            key: 'specialPrice',
            title: '塔型',
            width: 80,
            dataIndex: 'specialPrice'
        },
        {
            key: 'specialPrice',
            title: '电压等级',
            width: 80,
            dataIndex: 'specialPrice'
        },
        {
            key: 'specialPrice',
            title: '客户名称',
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
            key: 'specialPrice',
            title: '存档时间',
            width: 80,
            dataIndex: 'specialPrice'
        },
        {
            key: 'specialPrice',
            title: '存档人',
            width: 80,
            dataIndex: 'specialPrice'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 150,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type="link" onClick={() => {
                        setType('detail');
                        setVisible(true);
                        setRowData(record);
                    }}>查看</Button>
                    <Button type="link" onClick={() => {
                        setType('edit');
                        setVisible(true);
                        setRowData(record);
                    }}>编辑</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={() => {
                            RequestUtil.delete(``).then(res => {
                                message.success('删除成功');
                                setRefresh(!refresh);
                            });
                        }}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link">删除</Button>
                    </Popconfirm>
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
    const [visible, setVisible] = useState<boolean>(false);
    const [type, setType] = useState<'edit' | 'new' | 'detail'>('new');
    const [filterValue, setFilterValue] = useState();
    const [refresh, setRefresh] = useState<boolean>(false);
    const [rowData, setRowData] = useState<any>();
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

    useEffect(() => {
        setConfirmLoading(confirmLoading);
    }, [confirmLoading])


    const { loading, data, run } = useRequest<ILofting[]>((pagenation?: TablePaginationConfig) => new Promise(async (resole, reject) => {
        const result = await RequestUtil.get<any>(`/tower-science/projectPrice/list`, { current: pagenation?.current || 1, size: pagenation?.size || 15, category: status });
        setPage({ ...result })
        resole(result?.records || [])
    }), { refreshDeps: [status] })

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

    return <Spin spinning={loading}>
        <Modal
            destroyOnClose
            key='DataArchivingNew'
            visible={visible}
            width="50%"
            title={type === 'new' ? '上传' : type === 'edit' ? '编辑' : '查看'}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={() => {
                setVisible(false);
                newRef.current?.resetFields();
            }}>
            <DataArchivingNew getLoading={(loading) => setConfirmLoading(loading)} type={type} record={rowData} ref={newRef} />
        </Modal>
        <Page
            path=""
            filterValue={filterValue}
            columns={columns}
            extraOperation={<Space size="small">
                <Radio.Group defaultValue={status} onChange={(event: RadioChangeEvent) => {
                    setStatus(event.target.value);
                    run();
                }}>
                    <Radio.Button value={'1'} key="1">全部</Radio.Button>
                    <Radio.Button value={'2'} key="2">正常</Radio.Button>
                    <Radio.Button value={'3'} key="3">变更</Radio.Button>
                    <Radio.Button value={'4'} key="4">无效</Radio.Button>
                </Radio.Group>
                <Button type="primary" onClick={() => {
                    setVisible(true);
                    setType('new');
                }} ghost>上传</Button>
            </Space>}
            searchFormItems={[
                {
                    name: "issueName",
                    label: '资料室',
                    children: <Select placeholder="请选择" style={{ width: 200 }} defaultValue={''}>
                        <Select.Option value="" key={0}>全部</Select.Option>
                        {supplyTypeOptions && supplyTypeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={index} value={id}>
                                {name}
                            </Select.Option>
                        })}
                    </Select>
                },
                {
                    name: "deptId",
                    label: "资料类型",
                    children: <Select placeholder="请选择" style={{ width: 200 }} defaultValue={''}>
                        <Select.Option value="" key={0}>全部</Select.Option>
                        {supplyTypeOptions && supplyTypeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={index} value={id}>
                                {name}
                            </Select.Option>
                        })}
                    </Select>
                },
                {
                    name: "deptId",
                    label: "产品类型",
                    children: <Select placeholder="请选择" style={{ width: 200 }} defaultValue={''}>
                        <Select.Option value="" key={0}>全部</Select.Option>
                        {supplyTypeOptions && supplyTypeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={index} value={id}>
                                {name}
                            </Select.Option>
                        })}
                    </Select>
                },
                {
                    name: "fuzzyQuery",
                    label: '模糊查询',
                    children: <Input placeholder="客户名称/工程名称/计划号/塔型名称" style={{ width: 300 }} />
                }
            ]}
            refresh={refresh}
            onFilterSubmit={(values: any) => {
                if (values.date) {
                    const formatDate = values.date.map((item: any) => item.format("YYYY-MM-DD"))
                    values.startTime = formatDate[0] + ' 00:00:00';
                    values.endTime = formatDate[1] + ' 23:59:59';
                    delete values.date
                }
                setFilterValue(values)
                return values;
            }}
        />
    </Spin>
}