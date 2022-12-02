/**
 * @author zyc
 * @copyright © 2022 
 * @description 业务处置管理-补件申请-申请-添加补件
 */

import React, { useImperativeHandle, forwardRef, useState } from "react";
import { Input, Radio, RadioChangeEvent, Select } from 'antd';
import { Page } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { addColumns } from "./patchApplication.json";
import { FixedType } from 'rc-table/lib/interface';

interface modalProps {
    readonly record?: any;
}

export default forwardRef(function AddPatch({ record }: modalProps, ref) {
    const [filterValue, setFilterValue] = useState({});
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [status, setStatus] = useState<1 | 2>(1)

    const { data: sectionsNames } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/productSegment/segmentList?productCategoryId=${record.productCategoryId}`);
        resole(data)
    }), {})

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            resolve(selectedRows.map(res => {
                return {
                    ...res,
                    productCategoryId: record.productCategoryId,
                    productCategoryName: record.productCategoryName,
                    basicsPartNum: 0,
                    totalWeight: 0,
                    structureId: res.id
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

    return <>
        <Page
            path={status === 1 ? "/tower-science/productStructure/supply/entry/list" : '/tower-science/trialAssembly'}
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
            requestData={{ productCategoryId: record?.productCategoryId }}
            extraOperation={
                <Radio.Group defaultValue={status} onChange={(event: RadioChangeEvent) => {
                    setStatus(event.target.value);
                    setFilterValue({})
                }}>
                    <Radio.Button value={1} key="1">零件</Radio.Button>
                    <Radio.Button value={2} key="2">电焊件</Radio.Button>
                </Radio.Group>}
            searchFormItems={[
                {
                    name: 'productCategoryName',
                    label: '塔型名称',
                    children: <p style={{ marginTop: '6px' }}>{record?.productCategoryName}</p>
                },
                {
                    name: 'segmentId',
                    label: '段名',
                    children: <Select placeholder="请选择段名" mode="multiple" allowClear style={{ width: '200px' }}>
                        {sectionsNames && sectionsNames.map(({ id, segmentName }: any, index: number) => {
                            return <Select.Option key={index} value={id}>
                                {segmentName}
                            </Select.Option>
                        })}
                    </Select>
                },
                {
                    name: 'code',
                    label: '件号名称',
                    children: <Input />
                },
                {
                    name: 'description',
                    label: '备注',
                    children: <Input />
                },
                {
                    name: 'specialCode',
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
                pagination: status === 1 ? false : {
                    pageSize: 50
                },
                rowSelection: {
                    selectedRowKeys: selectedRowKeys,
                    onChange: onSelectChange,
                    type: "checkbox",
                }
            }}
            onFilterSubmit={(values: Record<string, any>) => {
                if (values.segmentId) {
                    values.segmentId = values.segmentId.join(',');
                }
                setFilterValue(values);
                return values;
            }}
        />
    </>
})

