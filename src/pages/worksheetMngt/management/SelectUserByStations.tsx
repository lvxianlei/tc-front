import React, { useState } from 'react';
import { Button, Modal, Form, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Page } from '../../common';

interface SelectUserByStationsProps {
    onSelect: (selectedRows: Record<string, any>) => void;
    selectedKey?: string[];
    selectType?: 'radio' | 'checkbox';
    disabled?: boolean;
    station?: string;
}

export default function SelectUserByStations({
    onSelect,
    selectedKey = [],
    selectType = 'radio',
    disabled = false,
    station = ""
}: SelectUserByStationsProps): JSX.Element {
    const [visible, setVisible] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [filterValue, setFilterValue] = useState<any>({});
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>(selectedKey);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows)
        console.log(selectedRowKeys,selectedRows)
    }
    const columns = [
        {
            title: '账号',
            width: 100,
            dataIndex: 'account'
        },
        {
            title: '手机号',
            width: 100,
            dataIndex: 'phone'
        },
        {
            title: '姓名',
            width: 100,
            dataIndex: 'name'
        },
        {
            title: '岗位',
            width: 100,
            dataIndex: 'stationName'
        },
        {
            title: '部门',
            width: 150,
            dataIndex: 'deptName'
        },
        {
            title: '状态',
            width: 150,
            dataIndex: 'statusName'
        }
    ]
    
    return <>
        <Button disabled={disabled} size="small" type='link' onClick={() => setVisible(true)}><PlusOutlined /></Button>
        <Modal
            visible={visible}
            title="选择人员"
            onCancel={() => {
                setVisible(false);
                setSelectedKeys([])
                setSelectedRows([])
                form.resetFields();
            }}
            onOk={() => {
                setVisible(false);
                onSelect(selectedRows);
                setSelectedKeys([]);
                setSelectedRows([])
            }}
            width='60%'
        >
            <Page
                path="/tower-system/employee"
                columns={columns}
                headTabs={[]}
                requestData={{
                    stationIds: station
                }}
                tableProps={{
                    rowSelection: {
                        type: selectType,
                        selectedRowKeys: selectedKeys,
                        preserveSelectedRowKeys: true,
                        onChange: SelectChange,
                        getCheckboxProps: (record: Record<string, any>) => ({
                          disabled: record?.status  === 0
                        })
                    },
                    rowKey: "userId"
                }}
                searchFormItems={[
                    {
                        name: 'fuzzyQuery',
                        label: '模糊查询项',
                        children: <Input maxLength={50} placeholder="账号/手机号/姓名" />
                    }
                ]}
                filterValue={filterValue}
                onFilterSubmit={(values: Record<string, any>) => {
                    setFilterValue(values);
                    return values;
                }}
            />
        </Modal>
    </>
}