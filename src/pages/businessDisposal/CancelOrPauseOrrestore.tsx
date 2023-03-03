/**
 * @author zyc
 * @copyright © 2022
 * @description 业务处置管理-取消暂停恢复
 */

import React, { useRef, useState } from 'react';
import { Space, Input, Form, Spin, Button, TablePaginationConfig } from 'antd';
import { CommonTable } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './CancelOrPauseOrrestore.module.less';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../utils/RequestUtil';
import { Link } from 'react-router-dom';

export interface ILofting {
    readonly id?: string;
}

export interface EditRefProps {
    onSubmit: () => void
    resetFields: () => void
}

export interface IResponseData {
    readonly current: number;
    readonly size: number;
    readonly total: number;
    readonly records: any[];
}

export default function CancelOrPauseOrrestore(): React.ReactNode {
    const columns = [
        {
            key: 'planChangeNumber',
            title: '计划变更编号',
            width: 100,
            dataIndex: 'planChangeNumber'
        },
        {
            key: 'planNumber',
            title: '计划号',
            width: 100,
            dataIndex: 'planNumber'
        },
        {
            key: 'customerCompany',
            title: '客户名称',
            dataIndex: 'customerCompany',
            width: 80
        },
        {
            key: 'projectName',
            title: '工程名称',
            width: 80,
            dataIndex: 'projectName'
        },
        {
            key: 'changeType',
            title: '变更类型',
            width: 80,
            dataIndex: 'changeType',
            "type": "select",
            "enum": [
                {
                    "value": 0,
                    "label": "恢复"
                },
                {
                    "value": 1,
                    "label": "取消"
                },
                {
                    "value": 2,
                    "label": "暂停"
                }
            ]
        },
        {
            key: 'changeInformation',
            title: '修改内容',
            dataIndex: 'changeInformation',
            width: 150,
        },
        {
            key: 'createTime',
            title: '接收时间',
            width: 100,
            dataIndex: 'createTime'
        },
        {
            key: 'productCount',
            title: '基数',
            width: 50,
            dataIndex: 'productCount'
        },
        {
            key: 'totalWeight',
            title: '总重量',
            width: 80,
            dataIndex: 'totalWeight'
        },
        {
            key: 'businessUserName',
            title: '业务员',
            width: 80,
            dataIndex: 'businessUserName'
        },
        {
            key: 'processedTotalWeight',
            title: '已加工总重量',
            width: 80,
            dataIndex: 'processedTotalWeight'
        },
        {
            key: 'description',
            title: '备注',
            width: 100,
            dataIndex: 'description'
        }
    ]

    const tableColumns = [
        {
            key: 'productCategoryName',
            title: '塔型',
            width: 50,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productHeight',
            title: '呼高',
            width: 50,
            dataIndex: 'productHeight'
        },
        {
            key: 'productCount',
            title: '基数',
            width: 50,
            dataIndex: 'productCount'
        },
        {
            key: 'productCode',
            title: '杆塔号',
            width: 80,
            dataIndex: 'productCode'
        },
        {
            key: 'description',
            title: '备注',
            width: 80,
            dataIndex: 'description'
        },
        {
            key: 'isIssuedProduction',
            title: '是否生产下达',
            width: 80,
            dataIndex: 'isIssuedProduction',
            "type": "select",
            "enum": [
                {
                    "value": "0",
                    "label": "否"
                },
                {
                    "value": "1",
                    "label": "是"
                }
            ]
        },
        {
            key: 'isIssuedWorkshop',
            title: '是否下发车间',
            width: 80,
            dataIndex: 'isIssuedWorkshop',
            "type": "select",
            "enum": [
                {
                    "value": "0",
                    "label": "否"
                },
                {
                    "value": "1",
                    "label": "是"
                }
            ]
        },
        {
            key: 'processedWeight',
            title: '已加工重量吨',
            width: 80,
            dataIndex: 'processedWeight'
        },
        {
            key: 'operation',
            title: '已加工明细',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 50,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={styles.operationBtn}>
                    <Link to={`/businessDisposal/cancelOrPauseOrrestore/processedDetails/${record.id}`}>查看</Link>
                </Space>
            )
        }
    ]

    const [page, setPage] = useState({
        current: 1,
        size: 10,
        total: 0
    })

    const [form] = Form.useForm();
    const [filterValues, setFilterValues] = useState<Record<string, any>>();
    const [rowId, setRowId] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [detailData, setDetailData] = useState<any>();

    const { loading, data, run } = useRequest<ILofting[]>((pagenation: TablePaginationConfig, filterValue: Record<string, any>) => new Promise(async (resole, reject) => {
        const data: IResponseData = await RequestUtil.get<IResponseData>(`/tower-science/planChange`, { current: pagenation?.current || 1, size: pagenation?.size || 10, status: status, ...filterValue });
        setPage({ ...data });
        if (data.records.length > 0 && data.records[0]?.id) {
            detailRun(data.records[0]?.id)
            setRowId(data.records[0]?.id)
        } else {
            setDetailData([]);
        }
        resole(data?.records);
    }), {})

    const { run: detailRun } = useRequest<any>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result = await RequestUtil.get<any>(`/tower-science/planChange/${id}/record/list`);
            setDetailData(result)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSearch = (values: Record<string, any>) => {
        setFilterValues(values);
        run({}, { ...values });
    }

    const handleChangePage = (current: number, pageSize: number) => {
        setPage({ ...page, current: current, size: pageSize });
        run({ current: current, size: pageSize }, { ...filterValues })
    }

    const onRowChange = async (record: Record<string, any>) => {
        detailRun(record.id)
        setRowId(record.id)
    }

    return <Spin spinning={loading}>
        <Form form={form} layout="inline" className={styles.search} onFinish={onSearch}>
            <Form.Item label='模糊查询项' name="fuzzyMsg">
                <Input style={{ width: '400px' }} placeholder="计划号/客户名称/工程名称/业务员" />
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
                showSizeChanger: true,
                onChange: handleChangePage
            }}
            onRow={(record: Record<string, any>) => ({
                onClick: () => onRowChange(record),
                className: styles.tableRow
            })}
        />
        <div className={styles.bottomTable}>
            <CommonTable
                columns={tableColumns}
                dataSource={[...detailData || []]}
                pagination={false}
            />
        </div>
    </Spin>
}