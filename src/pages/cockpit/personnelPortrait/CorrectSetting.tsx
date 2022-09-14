/**
 * @author zyc
 * @copyright © 2022 
 * @description 驾驶舱-放样人员画像-正确率设置
 */

import React, { useImperativeHandle, forwardRef, useState } from "react";
import { Input, Select, Space } from 'antd';
import { Page } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { correctColumns } from "./personnelPortrait.json";
import { FixedType } from 'rc-table/lib/interface';

interface modalProps {
    readonly record?: any;
}

export default forwardRef(function CorrectSetting({ record }: modalProps, ref) {
    const [filterValue, setFilterValue] = useState({});
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);

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
                    productCategory: record.productCategoryName,
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

    return <Page
        path="/tower-science/productStructure/supply/entry/list"
        columns={[
            ...correctColumns,
            {
                key: 'operation',
                title: '操作',
                dataIndex: 'operation',
                fixed: 'right' as FixedType,
                width: 150,
                render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                    <Space direction="horizontal" size="small">
                        
                    </Space>
                )
            }
        ]}
        headTabs={[]}
        searchFormItems={[]}
    />
})

