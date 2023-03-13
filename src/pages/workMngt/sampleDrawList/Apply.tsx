/**
 * @author zyc
 * @copyright © 2023
 * @description 套用小样图
 */

import React, { useImperativeHandle, forwardRef, useState } from "react";
import { Spin, Form, Input, Button, Row, Col, Space } from 'antd';
import { CommonTable } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './sample.module.less';
import { useForm } from "antd/lib/form/Form";

interface ApplyProps {
    getLoading: (loading: boolean) => void
}

export default forwardRef(function Apply({ getLoading }: ApplyProps, ref) {
    const [searchForm] = useForm();
    const [filterValue, setFilterValue] = useState({});
    const [productCategoryId, setProductCategoryId] = useState<string>();
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [selectedPartKeys, setSelectedPartKeys] = useState<React.Key[]>([]);
    const [selectedPartRows, setSelectedPartRows] = useState<any[]>([]);

    const { loading, data, run } = useRequest<any>((filter: any) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-science/productCategory/small/sample/category`, {
                ...filter,
                ...filterValue
            });
            result && result?.length > 0 && setProductCategoryId(result[0]?.id)
            result && result?.length > 0 && detailRun(result[0]?.id)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [getLoading] })

    const { data: detailData, run: detailRun } = useRequest<any>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-science/productSegment/list/${id}`);
            result && result?.length > 0 && partRun(id, result[0]?.id)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true, refreshDeps: [getLoading] })

    const { data: partData, run: partRun } = useRequest<any>((id: string, segmentId: string) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-science/productStructure/getSegmentDetailList`, {
                productCategoryId: id,
                segmentId: segmentId
            });
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true, refreshDeps: [getLoading] })

    const { run: submitRun } = useRequest((postData: any) => new Promise(async (resole, reject) => {
        try {
            RequestUtil.post(`/tower-science/smallSample/reuse`, {
                productCategoryId: productCategoryId,
                ...postData
            }).then(res => {
                getLoading(false)
                resole(true)
            }).catch(e => {
                getLoading(false)
                reject(e)
            })
        } catch (error) {
            reject(error)
        }
    }), { manual: true })


    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            getLoading(true)
            await submitRun({
                segmentIdList: selectedPartKeys?.length > 0 ? [] : selectedKeys,
                structureIdList: selectedPartKeys
            })
            resolve(true);
        } catch (error) {
            reject(false)
        }
    })

    const resetFields = () => {

    }

    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'planNumber',
            title: '计划号',
            width: 150,
            dataIndex: 'planNumber'
        },
        {
            key: 'projectName',
            title: '工程名称',
            width: 120,
            dataIndex: 'projectName'
        },
        {
            key: 'productCategoryName',
            title: '塔型',
            width: 120,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productTypeName',
            title: '产品类型',
            width: 150,
            dataIndex: 'productTypeName'
        },
        {
            key: 'voltageGradeName',
            title: '电压等级',
            width: 150,
            dataIndex: 'voltageGradeName'
        }
    ]

    const paragraphColumns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'segmentName',
            title: '段号',
            width: 150,
            dataIndex: 'segmentName'
        },
        {
            key: 'code',
            title: '放样人',
            width: 120,
            dataIndex: 'code'
        },
        {
            key: 'BasicsPartTotalNum',
            title: '校核人',
            width: 120,
            dataIndex: 'BasicsPartTotalNum'
        }
    ]

    const pieceColumns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'segmentName',
            title: '零件号',
            width: 150,
            dataIndex: 'segmentName'
        }
    ]

    const searchFormItems = [
        {
            name: 'planNumber',
            label: '计划号',
            children: <Input maxLength={100} />
        },
        {
            name: 'productCategoryName',
            label: '塔型',
            children: <Input maxLength={100} />
        },
        {
            name: 'projectName',
            label: '工程名称',
            children: <Input maxLength={100} />
        }
    ]

    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows)
    }

    const SelectPartChange = (selectedRowKeys: React.Key[], selectedRows: any[]): void => {
        setSelectedPartKeys(selectedRowKeys);
        setSelectedPartRows(selectedRows)
    }

    const onFilterSubmit = (value: any) => {
        setFilterValue(value)
        return value
    }

    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit, resetFields]);

    return <Spin spinning={loading}>
        <Form form={searchForm} layout="inline" className={styles.search} onFinish={onFilterSubmit}>
            {
                searchFormItems?.map((res: any) => {
                    return <Form.Item label={res?.label} name={res?.name}>
                        {res?.children}
                    </Form.Item>
                })
            }
            <Form.Item>
                <Space direction="horizontal">
                    <Button type="primary" htmlType="submit">搜索</Button>
                    <Button htmlType="reset">重置</Button>
                </Space>
            </Form.Item>
        </Form>
        <Row gutter={12}>
            <Col span={12}>
                <CommonTable
                    columns={columns}
                    dataSource={data || []}
                    pagination={false}
                />
            </Col>
            <Col span={6}>
                <CommonTable
                    columns={paragraphColumns}
                    dataSource={detailData || []}
                    pagination={false}
                    rowSelection={{
                        selectedRowKeys: selectedKeys,
                        onChange: SelectChange
                    }}
                />
            </Col>
            <Col span={6}>
                <CommonTable
                    columns={pieceColumns}
                    dataSource={partData || []}
                    pagination={false}
                    rowSelection={{
                        selectedRowKeys: selectedPartKeys,
                        onChange: SelectPartChange
                    }}
                />
            </Col>
        </Row>
    </Spin>
})