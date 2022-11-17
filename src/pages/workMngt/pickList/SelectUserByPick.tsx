/**
* @author zyc
 * @copyright © 2022 
 * @description 选择用户来自
 * */
import React, { useState } from 'react';
import { Button, Modal, Form, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Page } from '../../common';

interface SelectUserByPickProps {
    onSelect: (selectedRows: Record<string, any>) => void;
    selectedKey?: string[];
    selectType?: 'radio' | 'checkbox';
    disabled?: boolean;
    requests?: Record<string, any>
}

export default function SelectUserByPick({
    onSelect,
    selectedKey = [],
    selectType = 'radio',
    disabled = false,
    requests = {}
}: SelectUserByPickProps): JSX.Element {
    const [visible, setVisible] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [filterValue, setFilterValue] = useState<any>({});
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>(selectedKey);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows)
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
        <Button disabled={disabled} type='link' onClick={() => setVisible(true)}><PlusOutlined /></Button>
        <Modal
            visible={visible}
            title="选择人员"
            onCancel={() => {
                setVisible(false);
                setSelectedKeys([])
                setSelectedRows([])
                setFilterValue({})
                form.resetFields();
            }}
            onOk={() => {
                setVisible(false);
                setFilterValue({})
                onSelect(selectedRows)
            }}
            width='60%'
        >
            <Page
                path="/tower-system/employee"
                columns={columns}
                headTabs={[]}
                requestData={{
                    ...requests
                }}
                tableProps={{
                    rowSelection: {
                        type: selectType,
                        selectedRowKeys: selectedKeys,
                        onChange: SelectChange,
                        getCheckboxProps: (record: Record<string, any>) => ({
                            disabled: record?.status === 0
                        })
                    }
                }}
                searchFormItems={[
                    {
                        name: 'deptName',
                        label: '部门',
                        children: <Form.Item initialValue={requests?.deptName} name={'deptName'}>
                            <Input maxLength={50} placeholder="请输入部门" />
                        </Form.Item>
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