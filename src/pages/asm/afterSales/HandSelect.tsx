import React, { useState } from 'react';
import { Button, Modal, Form, Input, message, Space } from 'antd';
import { CommonTable } from '../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import styles from './tower.module.less';

export default function HandSelect({ onSelect, selectedKey = [], ...props }: any): JSX.Element {

    const [visible, setVisible] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [detailData, setDetailData] = useState<any[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>(selectedKey);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows)
    }
    const [dataSource, setDataSource] = useState<any[]>([])

    const { loading, data, run } = useRequest<any[]>((filterValue: Record<string, any>) => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get<any>(`/tower-system/employee`, { current: 1, size: 10000, ...filterValue });
        setDataSource(data?.records)
        resole(data?.records);
    }))
    const onFinish = (value: Record<string, any>) => {
        console.log(value)
        run(value);
    }
    const columns = [
        {
            key: 'deptName',
            title: '责任部门',
            width: 150,
            dataIndex: 'deptName'
        },
        {
            key: 'name',
            title: '责任人',
            width: 150,
            dataIndex: 'name'
        },
        {
            key: 'stationName',
            title: '责任人岗位',
            width: 150,
            dataIndex: 'stationName'
        }
    ]


    return <>
        <Modal
            visible={visible}
            title="选择责任人"
            onCancel={() => {
                setVisible(false);
                setDetailData([])
                setSelectedKeys([])
                setSelectedRows([])
                form.resetFields();
            }}
            onOk={() => {
                if (selectedRows.length > 0) {
                    setVisible(false);
                    console.log(selectedRows)
                    onSelect(selectedRows)
                    setDetailData([])
                }
                else {
                    message.error('未选择责任人！')
                }
            }}
            width='60%'
        >
            <Form form={form} onFinish={onFinish} layout="inline" className={styles.topForm}>
                <Form.Item name="fuzzyQuery" label="模糊查询项">
                    <Input placeholder="请输入姓名进行查询" />
                </Form.Item>
                <Form.Item name="deptName" label="部门">
                    <Input placeholder="请输入部门名称进行查询" />
                </Form.Item>
                <Space direction="horizontal">
                    <Button type="primary" htmlType="submit">搜索</Button>
                    <Button type="ghost" onClick={() => {
                        form.setFieldsValue({
                            fuzzyQuery: '',
                            deptName: ''
                        })
                        run()
                    }}>重置</Button>
                </Space>
            </Form>
            <span>已选：{selectedRows.length > 0 ? selectedRows.map((item: any) => {
                return item.name
            })?.join(',') : ''}</span>
            <CommonTable
                columns={columns}
                rowSelection={{
                    type: 'checkbox',
                    selectedRowKeys: selectedKeys,
                    onChange: SelectChange
                }}
                scroll={{ y: 300 }}
                pagination={false}
                dataSource={[...dataSource]}
            />
        </Modal>
        <Button type='link' onClick={() => {
            setSelectedRows([])
            setSelectedKeys([])
            setVisible(true)
        }}>手动选择</Button>
    </>
}










