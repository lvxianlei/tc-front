/**
 * @author zyc
 * @copyright © 2022
 * @description 驾驶舱-放样人员画像
 */

import React, { useState } from 'react';
import { Space, Input, Form, Spin, Button, Row, Select, Modal } from 'antd';
import { CommonTable } from '../../common';
import styles from './PersonnelPortrait.module.less';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import { columns, tableColumns } from "./personnelPortrait.json";
import CorrectSetting from './CorrectSetting';

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
    const [visible, setVisible] = useState<boolean>(false);

    const { loading, data, run } = useRequest<any[]>((filterValue: Record<string, any>) => new Promise(async (resole, reject) => {
        const data: any[] = await RequestUtil.get<any[]>(`/tower-science/personal/work/load`, { type: status, ...filterValue });
        // setPage({ ...data });
        if (data?.length > 0 && data[0]?.id) {
            detailRun(data[0]?.userId, data[0]?.type)
        } else {
            setDetailData([]);
        }
        resole(data);
    }), {})

    const { run: detailRun } = useRequest<any>((id: string, type: number) => new Promise(async (resole, reject) => {
        try {
            let result = await RequestUtil.get<any>(`/tower-science/personal/work/load/detail/list`, {
                userId: id,
                type: type
            });
            result = result.map((res: any) => {
                return {
                    ...res,
                    type
                }
            })
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
        <Modal
                destroyOnClose
                key='CorrectSetting'
                visible={visible}
                title={'正确率设置'}
                footer={
                    <Button type='primary' onClick={() => setVisible(false)} ghost>关闭</Button>
                }
                width="80%"
                onCancel={() => setVisible(false)}>
                <CorrectSetting />
            </Modal>
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
        <Button type='primary' className={styles.btnTop} ghost>正确率设置</Button>
        <div className={styles.left}>
            <CommonTable
                haveIndex
                columns={columns}
                dataSource={data}
                pagination={false}
                onRow={(record: Record<string, any>) => ({
                    onClick: () => onRowChange(record),
                    className: styles.tableRow
                })}
            />
        </div>
        <div className={styles.right}>
            <CommonTable
                columns={[
                    ...tableColumns.map((item: any) => {
                        if (item.dataIndex === 'year') {
                            return ({
                                ...item,
                                title: () => {
                                    return <>
                                        <Row>年份选择</Row>
                                        <Row>
                                            <Select size="small" placeholder="请选择" style={{ width: "150px" }} onChange={(e) => {
                                                console.log(e)
                                            }}>
                                                <Select.Option value={'2021'} key="2021">2021</Select.Option>
                                                <Select.Option value={0} key="0">待入库</Select.Option>
                                                <Select.Option value={1} key="1">在库</Select.Option>
                                                <Select.Option value={2} key="2">借出</Select.Option>
                                                <Select.Option value={3} key="3">遗失</Select.Option>
                                            </Select>
                                        </Row>
                                    </>
                                }
                            })
                        }
                        return item
                    })
                ]}
                dataSource={[...detailData || []]}
                pagination={false}
            />
        </div>
    </Spin>
}