/**
 * @author zyc
 * @copyright © 2022 
 * @description 包捆列表-详情-原始包装清单
 */

import React, { forwardRef } from "react"
import { Spin } from 'antd'
import { CommonTable } from '../../common'
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'

interface OriginalListProps {
    id: string;
}

export default forwardRef(function OriginalList({ id }: OriginalListProps, ref) {

    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result = await RequestUtil.get(`/tower-production/package/getOriginalPackingList/${id}`);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })

    const tableColumns = [
        {
            key: 'balesCode',
            title: '包号',
            dataIndex: 'balesCode',
        },
        {
            key: 'pieceCode',
            title: '件号',
            dataIndex: 'pieceCode'
        },
        {
            key: 'structureSpec',
            title: '材料规格',
            dataIndex: 'structureSpec'
        },
        {
            key: 'length',
            title: '长度（mm）',
            dataIndex: 'length'
        },
        {
            key: 'num',
            title: '数量',
            dataIndex: 'num'
        },
        {
            key: 'basicsWeight',
            title: '重量（KG）',
            dataIndex: 'basicsWeight'
        },
        {
            key: 'description',
            title: '备注',
            dataIndex: 'description'
        }
    ]

    return <Spin spinning={loading}>
        <CommonTable
            columns={tableColumns}
            dataSource={data}
            pagination={false}
        />
    </Spin>
})