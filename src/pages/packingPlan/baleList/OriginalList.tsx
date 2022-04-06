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
    const page = {
        current: 1,
        pageSize: 10
    };

    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result = await RequestUtil.get(``);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })

    const tableColumns = [
        {
            key: 'teamName',
            title: '班组名称',
            dataIndex: 'teamName'
        },
        {
            key: 'classPresidentName',
            title: '班长',
            dataIndex: 'classPresidentName'
        }
    ]

    return <Spin spinning={loading}>
        <CommonTable
            columns={tableColumns}
            dataSource={data}
        //  pagination={{
        //      current: workshopTeam?.current || 0,
        //      pageSize: workshopTeam?.size || 0,
        //      total: workshopTeam?.total || 0,
        //      showSizeChanger: false
        //  }}
        //  onChange={(pagination: TablePaginationConfig) => {
        //      getTableDataSource(pagination);
        //  }}
        />
    </Spin>
})