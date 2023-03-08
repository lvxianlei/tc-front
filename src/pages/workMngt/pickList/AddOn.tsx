/**
 * @author zyc
 * @copyright © 2022 
 * @description rd1.2 特殊件号(调拨)
 */

import React, { useImperativeHandle, forwardRef, useState } from "react";
import { Spin, Form, Descriptions, InputNumber, Input, Modal, Button } from 'antd';
import { CommonTable, DetailContent } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';

interface AddOnProps {
    id: string;
    getLoading: (loading: boolean) => void
}

export default forwardRef(function AddOn({ id, getLoading }: AddOnProps, ref) {

    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-science/drawProductSegment/section/submit/count/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id, getLoading] })

    const { run: submitRun } = useRequest(() => new Promise(async (resole, reject) => {
        try {
            RequestUtil.post(`/tower-science/drawProductSegment/section/add/submit/${id}`).then(res => {
                resole(true)
                getLoading(false)
            }).catch(e => {
                getLoading(false)
                reject(e)
            })
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            getLoading(true)
            await submitRun()
            resolve(true);
        } catch (error) {
            reject(false)
        }
    })

    const columns = [
        {
            key: 'segmentName',
            title: '段号',
            dataIndex: 'segmentName',
            width: 50
        },
        {
            key: 'completedSegmentCount',
            title: '已下段数',
            width: 150,
            dataIndex: 'completedSegmentCount'
        },
        {
            key: 'addSegmentCount',
            title: '本次追加段数',
            width: 120,
            dataIndex: 'addSegmentCount'
        }
    ]

    useImperativeHandle(ref, () => ({ onSubmit }), [ref, onSubmit]);
    return <Spin spinning={loading}>
        <DetailContent title="配段信息">
            <CommonTable
                columns={columns}
                dataSource={data || []}
                pagination={false}
            />
        </DetailContent>
    </Spin>
})

