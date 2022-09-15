/**
 * @author zyc
 * @copyright © 2022 
 * @description 业务处置管理-返修单
 */

import React, { useState } from 'react';
import { Space, Input, DatePicker, Select, Button, Form, TablePaginationConfig } from 'antd';
import { FixedType } from 'rc-table/lib/interface';
import styles from './RepairList.module.less';
import { Link } from 'react-router-dom';
import { IResponseData } from '../../common/Page';
import { productTypeOptions } from '../../../configuration/DictionaryOptions';
import RequestUtil from '../../../utils/RequestUtil';
import { columns, detailColumns } from "./repairList.json"
import { Attachment, CommonTable } from '../../common';
import useRequest from '@ahooksjs/use-request';

export default function List(): React.ReactNode {
    const [detailData, setDetailData] = useState<any>();
    const [page, setPage] = useState({
        current: 1,
        size: 10,
        total: 0
    })
    const [form] = Form.useForm();
    const [filterValues, setFilterValues] = useState<Record<string, any>>();

    const { loading, data, run } = useRequest<any[]>((pagenation: TablePaginationConfig, filterValue: Record<string, any>) => new Promise(async (resole, reject) => {
        const data: IResponseData = await RequestUtil.get<IResponseData>(``, { current: pagenation?.current || 1, size: pagenation?.size || 10, ...filterValue });
        setPage({ ...data });
        if (data.records.length > 0 && data.records[0]?.id) {
            detailRun(data.records[0]?.id)
        } else {
            setDetailData([]);
        }
        resole(data?.records);
    }), {})

    const { run: detailRun } = useRequest<any>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result = await RequestUtil.get<any>(`/tower-science/supplyEntry/productCategory/list/${id}`);
            setDetailData(result);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onRowChange = async (record: Record<string, any>) => {
        detailRun(record.id)
    }

    const handleChangePage = (current: number, pageSize: number) => {
        setPage({ ...page, current: current, size: pageSize });
        run({ current: current, size: pageSize }, { ...filterValues })
    }

    const onSearch = (values: Record<string, any>) => {
        if (values.updateStatusTime) {
            const formatDate = values.updateStatusTime.map((item: any) => item.format("YYYY-MM-DD"));
            values.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
            values.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
        }
        setFilterValues(values);
        run({}, { ...values });
    }

    return <>
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Form form={form} layout="inline" className={styles.search} onFinish={onSearch}>
            <Form.Item label='日期' name="updateStatusTime">
                <DatePicker.RangePicker />
            </Form.Item>
            <Form.Item label='状态' name="status">
                <Select placeholder="请选择状态">
                    <Select.Option value={''} key="0">全部</Select.Option>
                    <Select.Option value={1} key="1">待处理</Select.Option>
                    <Select.Option value={2} key="2">已处理</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item label='产品类型' name="supplyType">
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
                <Input style={{ width: '400px' }} placeholder="返修单编号/不合格处置单编号/原下达单号/计划号/塔型" />
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
            columns={[
                ...columns,
                {
                    key: 'operation',
                    title: '操作',
                    dataIndex: 'operation',
                    fixed: 'right' as FixedType,
                    width: 80,
                    render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                        <Link to={`/businessDisposal/repairList/dispose/${record.id}`}>处理</Link>
                    )
                }]}
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
        <CommonTable
            haveIndex
            columns={detailColumns}
            dataSource={detailData || []}
            pagination={false} />
        <Attachment title="" dataSource={detailData?.attachInfoVos || []} />
        </Space>
    </>
}