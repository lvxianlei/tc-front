/**
 * @author zyc
 * @copyright © 2022 
 * @description WO-工单管理-工单管理-人工创建工单/编辑
 */

import React, { useImperativeHandle, forwardRef, useState } from "react";
import { Input } from 'antd';
import Page from "./Page";

interface UserTableProps {
    selectedKey?: string[];
    selectType?: 'radio' | 'checkbox';
    requests?: Record<string, any>
    searchItems?: any
}

export default forwardRef(function UserTable({
    selectedKey = [],
    selectType = 'radio',
    requests = {},
    searchItems = []
}: UserTableProps, ref) {
    const [filterValue, setFilterValue] = useState<any>({});
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([...selectedKey]);
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

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            resolve(selectedRows);
        } catch (error) {
            reject(false)
        }
    })

    const resetFields = () => {
        setSelectedKeys([]);
        setSelectedRows([])
    }

    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit, resetFields]);

    return <Page
        path="/tower-system/employee"
        columns={columns}
        headTabs={[]}
        requestData={{
            deptName: '技术部',
            ...requests
        }}
        tableProps={{
            rowKey: 'userId',
            rowSelection: {
                type: selectType,
                selectedRowKeys: [...selectedKeys],
                onChange: SelectChange,
                preserveSelectedRowKeys: true,
                getCheckboxProps: (record: Record<string, any>) => ({
                    disabled: record?.status === 0
                })
            }
        }}
        searchFormItems={[
            ...searchItems,
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
})
