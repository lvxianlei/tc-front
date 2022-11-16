/**
 * @author zyc
 * @copyright © 2022 
 * @description 业务处置管理-明细变更申请-申请-添加
 * */

import React, { useState } from 'react';
import { Button, Modal, Form, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Page } from '../../common';

interface SelectByTaskNumProps {
    onSelect: (selectedRows: Record<string, any>) => void;
    selectedKey?: string[];
    selectType?: 'radio' | 'checkbox';
    disabled?: boolean;
    requests?: Record<string, any>
}

export default function SelectByTaskNum({
    onSelect,
    selectedKey = [],
    selectType = 'radio',
    disabled = false,
    requests = {}
}: SelectByTaskNumProps): JSX.Element {
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
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'taskNum',
            title: '确认任务编号',
            width: 100,
            dataIndex: 'taskNum'
        },
        {
            key: 'scTaskNum',
            title: '营销任务编号',
            width: 100,
            dataIndex: 'scTaskNum'
        },
        {
            key: 'planNumber',
            title: '计划号',
            width: 100,
            dataIndex: 'planNumber'
        },
        {
            key: 'confirmName',
            title: '确认人',
            width: 200,
            dataIndex: 'confirmName'
        },
        {
            key: 'contractNum',
            title: '内部合同编号',
            width: 200,
            dataIndex: 'contractNum'
        },
        {
            key: 'projectName',
            title: '工程名称',
            width: 200,
            dataIndex: 'projectName'
        },
        {
            key: 'contractName',
            title: '合同名称',
            width: 100,
            dataIndex: 'contractName'
        },
        {
            key: 'aeName',
            title: '业务经理',
            width: 100,
            dataIndex: 'aeName'
        }
    ]

    return <>
        <Button disabled={disabled} type='link' onClick={() => setVisible(true)}><PlusOutlined /></Button>
        <Modal
            visible={visible}
            title="添加"
            onCancel={() => {
                setVisible(false);
                setSelectedKeys([])
                setSelectedRows([])
                form.resetFields();
            }}
            onOk={() => {
                setVisible(false);
                onSelect(selectedRows)
            }}
            width='60%'
        >
            <Page
                path="/tower-science/productChange/draw/list"
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
                        name: 'fuzzyMsg',
                        label: '模糊查询项',
                        children: <Input maxLength={50} width="200" placeholder="任务编号/合同名称/业务经理" />
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