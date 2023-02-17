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
    // const [page, setPage] = useState({
    //     current: 1,
    //     size: 10,
    //     total: 0
    // })

    const [form] = Form.useForm();
    const [filterValues, setFilterValues] = useState<Record<string, any>>();
    const [status, setStatus] = useState<number>(1);
    const [detailData, setDetailData] = useState<any>();

    const { loading, data, run } = useRequest<any[]>((filterValue: Record<string, any>) => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get<any>(`/tower-science/personal/work/load`, { type: status, ...filterValue });
        // setPage({ ...data });
        if (data?.workLoadVOList?.length > 0 && data?.workLoadVOList[0]?.id) {
            detailRun(data?.workLoadVOList[0]?.userId, data?.workLoadVOList[0]?.type)
        } else {
            setDetailData([]);
        }
        resole(data?.workLoadVOList);
    }), {})

    const { run: detailRun } = useRequest<any>((id: string, type: number) => new Promise(async (resole, reject) => {
        try {
            const result = await RequestUtil.get<any>(`/tower-science/personal/work/load/detail/list`, {
                userId: id,
                type: type
            });
            setDetailData(result)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSearch = (values: Record<string, any>) => {
        setFilterValues(values);
        run({ ...values });
    }

    // const handleChangePage = (current: number, pageSize: number) => {
    //     setPage({ ...page, current: current, size: pageSize });
    //     run({ current: current, size: pageSize }, { ...filterValues })
    // }

    const onRowChange = async (record: Record<string, any>) => {
        detailRun(record.userId, record.type)
    }

    return <Spin spinning={loading}>
        <Form form={form} layout="inline" className={styles.search} onFinish={onSearch}>
            <Form.Item name="userNme">
                <Input style={{ width: '200px' }} placeholder="姓名" />
            </Form.Item>
            <Form.Item>
                <Space direction="horizontal">
                    <Button type="primary" htmlType="submit">搜索</Button>
                    <Button htmlType="reset">重置</Button>
                </Space>
            </Form.Item>
        </Form>
        <Row>
            <Radio.Group defaultValue={status} onChange={(event: RadioChangeEvent) => {
                setStatus(event.target.value);
                setFilterValues({ type: event.target.value });
                run({ type: event.target.value })
            }}>
                <Radio.Button value={1} key="1">全部</Radio.Button>
                <Radio.Button value={2} key="2">放样</Radio.Button>
                <Radio.Button value={3} key="3">提料</Radio.Button>
                <Radio.Button value={4} key="4">编程</Radio.Button>
                <Radio.Button value={5} key="5">螺栓</Radio.Button>
            </Radio.Group>
        </Row>
        <div className={styles.left}>
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
                // pagination={{
                //     current: page.current,
                //     pageSize: page.size,
                //     total: page?.total,
                //     showSizeChanger: true,
                //     onChange: handleChangePage
                // }}
                pagination={false}
                onRow={(record: Record<string, any>) => ({
                    onClick: () => onRowChange(record),
                    className: styles.tableRow
                })}
            />
        </div>
        <div className={styles.right}>
            <CommonTable
                haveIndex
                columns={tableColumns}
                dataSource={[...detailData || []]}
                pagination={false}
            />
        </div>
    </Spin>
}