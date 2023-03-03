/**
 * @author zyc
 * @copyright © 2022
 * @description 驾驶舱-人员工作负荷-人员配置
 */

import React, { useImperativeHandle, forwardRef, useState } from "react";
import { Spin, Form, Input, Button, Space, Row, Col } from 'antd';
import { CommonTable } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './PersonnelLoad.module.less';
import { FixedType } from 'rc-table/lib/interface';
import { PlusSquareOutlined, DeleteOutlined } from '@ant-design/icons';

interface AllocationProps {
    getLoading: (loading: boolean) => void;
    type: string;
}

export default forwardRef(function Allocation({ getLoading, type }: AllocationProps, ref) {
    const [form] = Form.useForm();
    const [expansionId, setExpansionId] = useState<any>([])
    const [userData, setUserData] = useState<any>([]);
    const [selectedData, setSelectedData] = useState<any>([]);
    const [rowId, setRowId] = useState<string>('');
    const [filterValue, setFilterValue] = useState<any>();

    const columns = [
        {
            key: 'name',
            title: '名称',
            width: 150,
            dataIndex: 'name'
        }
    ]

    const userColumns = [
        {
            key: 'name',
            title: '名称',
            width: 150,
            dataIndex: 'name'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 50,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <>
                    <Button type="link" onClick={() => {
                        userData?.splice(index, 1)
                        setUserData([...userData])
                        setSelectedData([...selectedData, record])
                    }}><PlusSquareOutlined /></Button>
                </>
            )
        }
    ]

    const selectedColumns = [
        {
            key: 'name',
            title: '名称',
            width: 150,
            dataIndex: 'name'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 50,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <>
                    <Button type="link" onClick={() => {
                        selectedData?.splice(index, 1)
                        setSelectedData([...selectedData]);
                        getUserData(rowId, filterValue)
                    }}><DeleteOutlined /></Button>
                </>
            )
        }
    ]

    const { loading } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            let result = await RequestUtil.get<any>(`/tower-science/staffing?type=${type === '放样员' ? 2 : type === '提料员' ? 3 : type === '编程员' ? 4 : 5}`);
            setSelectedData([...result?.map((res: any) => {
                return {
                    ...res,
                    name: res?.userName
                }
            })])
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [getLoading] })


    const { data: deptData } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            let result = await RequestUtil.get<any>(`/tower-system/department`);
            setRowId(result && result[0]?.id)
            setExpansionId(result?.map((res: any) => res?.id))
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), {})

    const { run: getUserData } = useRequest<any>((id: string, filter: any) => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-system/employee`, {
            dept: id,
            size: 10000,
            ...filter
        });
        setRowId(id ? id : deptData[0]?.id)
        const selected = selectedData?.map((res: any) => res?.userId)
        const newData = data?.records?.filter((res: any) => selected?.indexOf(res?.userId) === -1)
        setUserData([...newData])
    }), { manual: true })

    const onSearch = (values: Record<string, any>) => {
        getUserData(rowId === deptData[0]?.id ? '' : rowId, { ...values });
        setFilterValue({ ...values })
    }

    const { run: submitRun } = useRequest((postData: any) => new Promise(async (resole, reject) => {
        try {
            RequestUtil.post(`/tower-science/staffing`, postData).then(res => {
                resole(true)
                getLoading(false)
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
                staffingDTOList: selectedData?.map((res: any) => {
                    return {
                        userId: res?.userId,
                        type: type === '放样员' ? 2 : type === '提料员' ? 3 : type === '编程员' ? 4 : 5
                    }
                }),
                type: type === '放样员' ? 2 : type === '提料员' ? 3 : type === '编程员' ? 4 : 5
            })
            resolve(true);
        } catch (error) {
            reject(false)
        }
    })

    const resetFields = () => {
        form.resetFields();
    }

    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit, resetFields]);
    return <Spin spinning={loading}>
        <Row justify="space-between">
            <Col>
                <Form form={form} layout="inline" className={styles.search} onFinish={onSearch}>
                    <Form.Item name="fuzzyQuery">
                        <Input style={{ width: '200px' }} placeholder="姓名" />
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
                <Button type="link" onClick={() => {
                    setSelectedData([])
                    setUserData([])
                    setRowId(deptData && deptData[0]?.id)
                }}>清空列表</Button>
            </Col>
        </Row>
        <Row gutter={12}>
            <Col span={10}>
                <CommonTable
                    scroll={{ y: 500 }}
                    columns={columns}
                    dataSource={deptData}
                    pagination={false}
                    showHeader={false}
                    expandable={{
                        defaultExpandAllRows: true,
                        expandedRowKeys: expansionId,
                        onExpandedRowsChange: (expandedRows: any) => {
                            setExpansionId(expandedRows)
                        }
                    }}
                    onRow={(record: Record<string, any>) => ({
                        onClick: () => getUserData(record?.id),
                        className: rowId === record?.id ? styles.highLight : styles.tableRow
                    })}
                />
            </Col>
            <Col span={7}>
                <CommonTable
                    columns={userColumns}
                    dataSource={userData || []}
                    className={styles?.userTable}
                    pagination={false}
                    showHeader={false}
                />
            </Col>
            <Col span={7}>
                <CommonTable
                    columns={selectedColumns}
                    dataSource={selectedData || []}
                    pagination={false}
                    showHeader={false}
                />

            </Col>
        </Row>
    </Spin>
})

