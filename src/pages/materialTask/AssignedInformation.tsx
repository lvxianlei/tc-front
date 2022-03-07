/**
 * @author zyc
 * @copyright © 2022
 * @description 提料任务-指派信息
 */

import React, { forwardRef } from "react"
import { Spin, Descriptions } from 'antd'
import { CommonTable, DetailTitle } from '../common'
import RequestUtil from '../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import styles from './MaterialTaskList.module.less';
import { IAssignedList } from "./IMaterialTask"

export interface EditProps {
    id: string
}

export default forwardRef(function Edit({ id }: EditProps, ref) {

    const { loading, data } = useRequest<IAssignedList>(() => new Promise(async (resole, reject) => {
        try {
            const result: IAssignedList = await RequestUtil.get<IAssignedList>(`/tower-science/materialProductCategory/material/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })


    const tableColumns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 120,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'createDeptName',
            title: '操作部门',
            dataIndex: 'createDeptName',
            width: 100
        },
        {
            key: 'createUserName',
            title: '操作人',
            dataIndex: 'createUserName',
            width: 220,

        },
        {
            key: 'createTime',
            title: '操作时间',
            dataIndex: 'createTime',
            width: 120
        },
        {
            key: 'currentStatus',
            title: '操作',
            dataIndex: 'currentStatus',
            width: 150
        },
        {
            key: 'description',
            title: '备注',
            dataIndex: 'description',
            width: 180
        }
    ]


    return <Spin spinning={loading}>
        <DetailTitle title="指派信息" />
        <Descriptions bordered column={6} className={styles.heightScroll}>
            <Descriptions.Item label="塔型">
                {data?.productCategoryName}
            </Descriptions.Item>
            <Descriptions.Item label="模式">
                {data?.patternName}
            </Descriptions.Item>
            <Descriptions.Item label="提料负责人">
                {data?.materialLeaderName}
            </Descriptions.Item>
            <Descriptions.Item label="优先级">
                {data?.priorityName}
            </Descriptions.Item>
            <Descriptions.Item label="计划交付时间">
                {data?.materialDeliverTime}
            </Descriptions.Item>
            <Descriptions.Item label="备注">
                {data?.description}
            </Descriptions.Item>
        </Descriptions>
        <DetailTitle title="操作信息" style={{ padding: '8px 0' }} />
        <CommonTable
            scroll={{ x: 500 }}
            rowKey="id"
            dataSource={data?.statusRecordList}
            pagination={false}
            columns={tableColumns}
            className={styles.addModal} />
    </Spin>
})