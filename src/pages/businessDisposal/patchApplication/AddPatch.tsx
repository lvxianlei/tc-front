/**
 * @author zyc
 * @copyright © 2022 
 * @description 业务处置管理-补件申请-申请-添加补件
 */

import React, { useImperativeHandle, forwardRef, useState } from "react";
import { Form, Input, InputNumber, Select } from 'antd';
import { DetailContent, Page } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { productTypeOptions } from "../../../configuration/DictionaryOptions";
import { addColumns } from "./patchApplication.json";
import { FixedType } from 'rc-table/lib/interface';

interface modalProps {
    readonly record?: any;
}

export default forwardRef(function AddPatch({ record }: modalProps, ref) {
    const [filterValue, setFilterValue] = useState({});
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            console.log(selectedRows)
            resolve(selectedRows.map(res => {
                return {
                    ...res,
                    productCategoryId: record.id
                }
            }));
        } catch (error) {
            reject(false)
        }
    })

    useImperativeHandle(ref, () => ({ onSubmit }), [ref, onSubmit]);

    const onSelectChange = (selectedRowKeys: any[], selectRows: any[]) => {
        setSelectedRowKeys(selectedRowKeys);
        setSelectedRows(selectRows);
    }

    return <Page
        path="/tower-science/loftingTask/taskPage"
        columns={[
            {
                key: 'index',
                title: '序号',
                dataIndex: 'index',
                width: 50,
                fixed: "left" as FixedType,
                render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
            }, ...addColumns]}
        headTabs={[]}
        requestData={{ id: record?.id }}
        searchFormItems={[
            {
                name: 'updateStatusTime',
                label: '塔型名称',
                children: <p>塔型名称</p>
            },
            {
                name: 'updateStatusTime',
                label: '补件类型',
                children: <Select placeholder="请选择补件类型">
                    {productTypeOptions && productTypeOptions.map(({ id, name }, index) => {
                        return <Select.Option key={index} value={id}>
                            {name}
                        </Select.Option>
                    })}
                </Select>
            },
            {
                name: 'updateStatusTime',
                label: '件号名称',
                children: <Input />
            },
            {
                name: 'updateStatusTime',
                label: '备注',
                children: <Input />
            },
            {
                name: 'updateStatusTime',
                label: '特殊件号',
                children: <Select placeholder="请选择特殊件号">
                    <Select.Option value={''} key={0}>全部</Select.Option>
                    <Select.Option value={1} key={1}>是</Select.Option>
                    <Select.Option value={2} key={2}>否</Select.Option>
                </Select>
            }
        ]}
        filterValue={filterValue}
        tableProps={{
            pagination: false,
            rowSelection: {
                selectedRowKeys: selectedRowKeys,
                onChange: onSelectChange,
                type: "checkbox",
            }
        }}
        onFilterSubmit={(values: Record<string, any>) => {
            setFilterValue(values);
            return values;
        }}
    />
})

