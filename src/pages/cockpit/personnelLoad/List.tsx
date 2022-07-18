/**
 * @author zyc
 * @copyright © 2022
 * @description 驾驶舱-人员工作负荷
 */

import React, { useState } from 'react';
import { Space, Input, Form, Spin, Button, TablePaginationConfig, Radio, RadioChangeEvent, Row } from 'antd';
import { CommonTable } from '../../common';
import styles from './PersonnelLoad.module.less';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import { columns, tableColumns } from "./personnelLoad.json"

export interface IPersonnelLoad {
    readonly id?: string;
}

export interface IResponseData {
    readonly total: number;
    readonly size: number;
    readonly current: number;
    readonly records: IPersonnelLoad[];
}

export default function List(): React.ReactNode {
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

    const { loading, data, run } = useRequest<IPersonnelLoad[]>((pagenation: TablePaginationConfig, filterValue: Record<string, any>) => new Promise(async (resole, reject) => {
        const data: IResponseData = await RequestUtil.get<IResponseData>(`/tower-tdm/loftProcess/projectTowerTypePage`, { current: pagenation?.current || 1, size: pagenation?.size || 10, status: status, ...filterValue });
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
            const result = await RequestUtil.get<any>(`/tower-tdm/loftProcess/getSegAssignList/${id}`);
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
            <Form.Item name="fuzzyMsg">
                <Input style={{ width: '200px' }} placeholder="姓名" />
            </Form.Item>
            <Form.Item>
                <Space direction="horizontal">
                    <Button type="primary" htmlType="submit">搜索</Button>
                    <Button htmlType="reset">重置</Button>
                </Space>
            </Form.Item>
        </Form>
        <Row className={styles.search}>
            <Radio.Group defaultValue={status} onChange={(event: RadioChangeEvent) => {
                setStatus(event.target.value);
                setFilterValues({ status: event.target.value });
                run({}, { status: event.target.value })
            }}>
                <Radio.Button value={''} key="0">全部</Radio.Button>
                <Radio.Button value={'1'} key="1">放样</Radio.Button>
                <Radio.Button value={'2'} key="2">提料</Radio.Button>
                <Radio.Button value={'3'} key="3">编程</Radio.Button>
                <Radio.Button value={'3'} key="3">螺栓</Radio.Button>
            </Radio.Group>
        </Row>
        <CommonTable
            haveIndex
            columns={[
                ...columns.map((item: any) => {
                    if (item.dataIndex === 'segmentName') {
                        return ({
                            ...item,
                            sorter: (a: any, b: any) => a.segmentName - b.segmentName
                        })
                    }
                    return item
                })
            ]}
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
                haveIndex
                columns={tableColumns}
                dataSource={[...detailData || []]}
                pagination={false}
            />
        </div>
    </Spin>
}