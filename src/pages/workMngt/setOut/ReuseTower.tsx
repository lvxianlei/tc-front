/**
 * @author zyc
 * @copyright © 2022 
 * @description 复用杆塔
 */

import React, { useImperativeHandle, forwardRef, useState } from "react";
import { Spin } from 'antd';
import { CommonTable, DetailContent } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { IResponseData } from "./ISetOut";

interface ReuseTowerProps {
    id: string;
}

export interface EditProps {
    onSubmit: () => void
}

export default forwardRef(function ReuseTower({ id }: ReuseTowerProps, ref) {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const columns = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            title: '杆塔号',
            dataIndex: 'productNumber',
            key: 'productNumber'
        },
        {
            title: '呼高',
            dataIndex: 'productHeight',
            key: 'productHeight'
        }
    ]

    const { loading, data } = useRequest<[]>(() => new Promise(async (resole, reject) => {
        try {
            const result = await RequestUtil.get<IResponseData>(`/tower-science/product/lofting?page=1&size=1000&productCategoryId=${id}`);
            resole(result.records)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            resolve(selectedRowKeys);
        } catch (error) {
            reject(false)
        }
    })

    useImperativeHandle(ref, () => ({ onSubmit }), [ref, onSubmit]);

    return <Spin spinning={loading}>
        <DetailContent style={{ padding: '16px' }}>
            <CommonTable dataSource={data} pagination={false} rowSelection={{
                selectedRowKeys: selectedRowKeys,
                onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
                    setSelectedRowKeys(selectedRowKeys);
                }
            }} columns={columns} />
        </DetailContent>
    </Spin>
})

